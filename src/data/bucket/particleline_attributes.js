//@flow
/*
 * @Author: hydata
 * @Date:   2018-05-30 17:34:35
 * @Last Modified by:   hydata
 * @Last Modified time: 2018-06-11 17:14:45
 */
import {
    createLayout
} from '../../util/struct_array';

const layout = createLayout([{
    name: "a_pos_normal",
    components: 4,
    type: "Int16"
}, {
    name: "a_data",
    components: 4,
    type: "Uint8"
}, {
    name: "a_extra_m",
    components: 3,
    type: "Uint8"
}, {
    name: "a_i_p_e",
    components: 2,
    type: "Uint16"
}], 4);

export default layout;
export const {
    members,
    size,
    alignment
} = layout;
