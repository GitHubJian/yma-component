import './svg/arrow_down_s.svg';
import './svg/arrow_triangle_down.svg';
import './svg/blank-contents-empty.svg';
import './svg/error.svg';
import './svg/info.svg';
import './svg/success.svg';
import './svg/symbol_cross.svg';
import './svg/symbol_tick.svg';
import './svg/warning.svg';

export function registerIcons(requireContext) {
    if (!requireContext || typeof requireContext.keys !== 'function') {
        return;
    }
    requireContext.keys().forEach(key => requireContext(key));
}
