const _IMG_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i;

const _cdnRangeOk = async (url) => {
  try {
    const r = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: { Range: "bytes=0-0" },
    });
    return r.ok;
  } catch (_e) {
    return false;
  }
};

export const jsdelivrTreeLooksSane = async (repoPath, tree) => {
  if (!repoPath) return false;
  if (!tree || !Array.isArray(tree.paths) || tree.paths.length === 0)
    return false;

  const ref = tree.ref || "HEAD";
  const imgCandidates = tree.paths.filter((p) => _IMG_EXT.test(p));
  const pathsToCheck = (
    imgCandidates.length ? imgCandidates : tree.paths
  ).slice(0, 6);

  for (const p of pathsToCheck) {
    const url =
      "https://cdn.jsdelivr.net/gh/" +
      repoPath +
      "@" +
      ref +
      "/" +
      String(p).replace(/^\/+/, "");
    if (!(await _cdnRangeOk(url))) return false;
  }

  return true;
};
