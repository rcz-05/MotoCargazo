import AsyncStorage from "@react-native-async-storage/async-storage";
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { UserRole } from "@motocargazo/types";
import { demoProviders } from "./demoCatalog";
import { isDemoApp } from "./app-mode";
import { supabase } from "./supabase";

type RoleSession = {
  role: UserRole | null;
  organizationId: string | null;
  organizationName: string | null;
  city: string | null;
};

type SessionContextValue = {
  session: Session | null;
  roleSession: RoleSession;
  isDemoSession: boolean;
  loading: boolean;
  refreshRoleSession: () => Promise<void>;
  enterDemoSession: (role: "restaurant" | "producer") => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);
const DEMO_SESSION_KEY = "motocargo:demo-role";
const defaultDemoRole: "restaurant" = "restaurant";
const emptyRoleSession: RoleSession = {
  role: null,
  organizationId: null,
  organizationName: null,
  city: null
};
const demoProducer = demoProviders.find((provider) => provider.categories.includes("meat")) ?? demoProviders[0];

function buildDemoRoleSession(role: "restaurant" | "producer"): RoleSession {
  if (role === "producer") {
    return {
      role,
      organizationId: demoProducer?.id ?? "demo-producer",
      organizationName: demoProducer?.name ?? "Proveedor Demo Sevilla",
      city: "Sevilla"
    };
  }

  return {
    role,
    organizationId: "demo-restaurant",
    organizationName: "Restaurante Demo Sevilla",
    city: "Sevilla"
  };
}

async function loadRoleSession(userId: string): Promise<RoleSession> {
  const { data, error } = await supabase
    .from("memberships")
    .select("role, organization_id, is_primary")
    .eq("user_id", userId)
    .order("is_primary", { ascending: false });

  if (error || !data || data.length === 0) {
    return emptyRoleSession;
  }

  const chosenMembership = data[0];

  const { data: orgData } = await supabase
    .from("organizations")
    .select("name, city")
    .eq("id", chosenMembership.organization_id)
    .maybeSingle();

  return {
    role: chosenMembership.role as UserRole,
    organizationId: chosenMembership.organization_id,
    organizationName: orgData?.name ?? null,
    city: orgData?.city ?? null
  };
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [demoRole, setDemoRole] = useState<"restaurant" | "producer" | null>(isDemoApp ? defaultDemoRole : null);
  const [roleSession, setRoleSession] = useState<RoleSession>(isDemoApp ? buildDemoRoleSession(defaultDemoRole) : emptyRoleSession);
  const [loading, setLoading] = useState(!isDemoApp);
  const demoRoleRef = useRef<"restaurant" | "producer" | null>(isDemoApp ? defaultDemoRole : null);

  const refreshRoleSession = async () => {
    if (isDemoApp) {
      setSession(null);
      setRoleSession(buildDemoRoleSession(defaultDemoRole));
      return;
    }

    if (!session?.user?.id) {
      const persistedDemoRole = demoRoleRef.current;
      setRoleSession(persistedDemoRole ? buildDemoRoleSession(persistedDemoRole) : emptyRoleSession);
      return;
    }

    const rs = await loadRoleSession(session.user.id);
    setRoleSession(rs);
  };

  useEffect(() => {
    if (isDemoApp) {
      demoRoleRef.current = defaultDemoRole;
      setDemoRole(defaultDemoRole);
      setSession(null);
      setRoleSession(buildDemoRoleSession(defaultDemoRole));
      setLoading(false);
      return;
    }

    let mounted = true;

    const bootstrapSession = async () => {
      try {
        const [{ data }, persistedDemoRole] = await Promise.all([
          supabase.auth.getSession(),
          AsyncStorage.getItem(DEMO_SESSION_KEY)
        ]);
        if (!mounted) return;
        setSession(data.session);

        const normalizedDemoRole =
          persistedDemoRole === "restaurant" || persistedDemoRole === "producer" ? persistedDemoRole : null;

        demoRoleRef.current = normalizedDemoRole;
        setDemoRole(normalizedDemoRole);

        if (data.session?.user?.id) {
          const rs = await loadRoleSession(data.session.user.id);
          if (mounted) setRoleSession(rs);
        } else if (normalizedDemoRole) {
          setRoleSession(buildDemoRoleSession(normalizedDemoRole));
        } else {
          setRoleSession(emptyRoleSession);
        }
      } catch {
        const persistedDemoRole = await AsyncStorage.getItem(DEMO_SESSION_KEY);
        const normalizedDemoRole =
          persistedDemoRole === "restaurant" || persistedDemoRole === "producer" ? persistedDemoRole : null;

        if (mounted) {
          demoRoleRef.current = normalizedDemoRole;
          setDemoRole(normalizedDemoRole);
          setSession(null);
          setRoleSession(normalizedDemoRole ? buildDemoRoleSession(normalizedDemoRole) : emptyRoleSession);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    bootstrapSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);

      if (nextSession?.user?.id) {
        demoRoleRef.current = null;
        setDemoRole(null);
        await AsyncStorage.removeItem(DEMO_SESSION_KEY);
        const rs = await loadRoleSession(nextSession.user.id);
        if (mounted) setRoleSession(rs);
      } else if (demoRoleRef.current) {
        setRoleSession(buildDemoRoleSession(demoRoleRef.current));
      } else {
        setRoleSession(emptyRoleSession);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      roleSession,
      isDemoSession: isDemoApp || (Boolean(demoRole) && !session?.user?.id),
      loading,
      refreshRoleSession,
      enterDemoSession: async (role) => {
        if (isDemoApp) {
          demoRoleRef.current = defaultDemoRole;
          setDemoRole(defaultDemoRole);
          setRoleSession(buildDemoRoleSession(defaultDemoRole));
          setSession(null);
          setLoading(false);
          return;
        }

        demoRoleRef.current = role;
        setDemoRole(role);
        setRoleSession(buildDemoRoleSession(role));
        setSession(null);
        setLoading(false);
        await AsyncStorage.setItem(DEMO_SESSION_KEY, role);
      },
      signOut: async () => {
        if (isDemoApp) {
          demoRoleRef.current = defaultDemoRole;
          setDemoRole(defaultDemoRole);
          setSession(null);
          setRoleSession(buildDemoRoleSession(defaultDemoRole));
          setLoading(false);
          return;
        }

        demoRoleRef.current = null;
        setDemoRole(null);
        await AsyncStorage.removeItem(DEMO_SESSION_KEY);
        setRoleSession(emptyRoleSession);
        await supabase.auth.signOut();
      }
    }),
    [session, roleSession, loading, demoRole]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }

  return context;
}
