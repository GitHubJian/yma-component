const requireAll = requireContext => requireContext.keys().map(requireContext);
const reqAsset = require.context('@/asset/svg', false, /\.svg$/);
requireAll(reqAsset);

const reqLocal = require.context('./svg', false, /\.svg$/);
requireAll(reqLocal);
