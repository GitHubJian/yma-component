const requireAll = requireContext => requireContext.keys().map(requireContext);

const reqLocal = require.context('./svg', false, /\.svg$/);
requireAll(reqLocal);
