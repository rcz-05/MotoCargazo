import { Image as ExpoImage } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ImageResizeMode, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {
  AppImageSource,
  AppImageSourceInput,
  dedupeImageSources,
  flattenImageSources,
  getImageSourceKey,
  normalizeImageSource,
  preloadImageSource,
  preloadImageSources
} from "../lib/imageSources";
import { colors, radius } from "../lib/theme";

type Props = {
  source?: AppImageSource;
  fallbackSource?: AppImageSourceInput;
  style?: StyleProp<ViewStyle>;
  resizeMode?: ImageResizeMode;
  borderRadius?: number;
  loadingStrategy?: "auto" | "eager";
  testID?: string;
};

function resolveContentFit(resizeMode: ImageResizeMode) {
  if (resizeMode === "contain") return "contain";
  if (resizeMode === "stretch") return "fill";
  if (resizeMode === "center") return "scale-down";
  return "cover";
}

export function AppImage({
  source,
  fallbackSource,
  style,
  resizeMode = "cover",
  borderRadius = radius.md,
  loadingStrategy = "auto",
  testID
}: Props) {
  const chain = useMemo(() => {
    const ordered = dedupeImageSources([source, ...flattenImageSources(fallbackSource)]);
    return ordered;
  }, [source, fallbackSource]);

  const chainKey = useMemo(() => chain.map((item) => getImageSourceKey(item)).join("|"), [chain]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(Boolean(chain[0]));

  useEffect(() => {
    setIndex(0);
    setLoading(Boolean(chain[0]));
  }, [chain, chainKey]);

  const current = chain[index];
  const nextCandidate = chain[index + 1];

  useEffect(() => {
    if (!nextCandidate) return;
    void preloadImageSource(nextCandidate);
  }, [nextCandidate]);

  useEffect(() => {
    if (loadingStrategy !== "eager") return;
    void preloadImageSources(chain.slice(1));
  }, [chain, loadingStrategy]);

  return (
    <View style={[styles.container, { borderRadius }, style]} testID={testID}>
      {current ? (
        <ExpoImage
          source={normalizeImageSource(current)}
          style={styles.image}
          contentFit={resolveContentFit(resizeMode)}
          cachePolicy="memory-disk"
          transition={180}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          onError={() => {
            if (index < chain.length - 1) {
              setIndex((value) => value + 1);
              setLoading(Boolean(chain[index + 1]));
            } else {
              setLoading(false);
            }
          }}
        />
      ) : null}

      {!loading && !current ? <View style={styles.emptyFill} /> : null}

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="small" color={colors.brandDark} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#DDD6CD"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  loaderWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(248,243,232,0.45)"
  },
  emptyFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(218,208,195,0.5)"
  }
});
