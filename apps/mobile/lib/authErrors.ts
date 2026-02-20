const networkErrorHint =
  "No se pudo conectar con el servidor. Si estás en un teléfono físico, verifica que el móvil y tu laptop estén en la misma red Wi-Fi.";

function normalizeMessage(input: unknown): string {
  if (input instanceof Error) return input.message.toLowerCase();
  if (typeof input === "string") return input.toLowerCase();
  if (typeof input === "object" && input && "message" in input && typeof input.message === "string") {
    return input.message.toLowerCase();
  }
  return "";
}

function isNetworkMessage(message: string): boolean {
  return (
    message.includes("network request failed") ||
    message.includes("failed to fetch") ||
    message.includes("networkerror") ||
    message.includes("fetch")
  );
}

export function mapLoginError(error: unknown): string {
  const message = normalizeMessage(error);

  if (isNetworkMessage(message)) return networkErrorHint;
  if (message.includes("invalid login credentials")) return "Credenciales inválidas. Revisa email y contraseña.";
  if (message.includes("email not confirmed")) return "Tu correo aún no está confirmado.";

  return "No se pudo iniciar sesión. Inténtalo de nuevo.";
}

export function mapRegisterError(error: unknown): string {
  const message = normalizeMessage(error);

  if (isNetworkMessage(message)) return networkErrorHint;
  if (message.includes("user already registered")) return "Este email ya está registrado. Inicia sesión.";
  if (message.includes("password")) return "La contraseña no cumple los requisitos mínimos.";
  if (message.includes("signup is disabled")) return "El registro está deshabilitado temporalmente.";
  if (message.includes("producer_invitation_required")) return "Registro de proveedor solo por invitación activa.";

  return "No se pudo crear la cuenta. Revisa los datos e inténtalo nuevamente.";
}

export function mapForgotPasswordError(error: unknown): string {
  const message = normalizeMessage(error);

  if (isNetworkMessage(message)) return networkErrorHint;
  if (message.includes("email")) return "Revisa que el email sea válido.";

  return "No fue posible enviar el correo de recuperación.";
}
