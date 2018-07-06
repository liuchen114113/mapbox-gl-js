/*
 * @Description: airline拓展 
 * @Author: liuchen@hiynn.com 
 * @Date: 2018-06-19 10:40:14 
 * @Last Modified by: liuchen
 * @Last Modified time: 2018-06-19 10:40:40
 */

// @flow
import { createLayout } from '../../util/struct_array';

const layout = createLayout([
    {name: 'a_pos_normal', components: 4, type: 'Int16'},
    {name: 'a_data', components: 4, type: 'Uint8'},
    {name: "a_height", components: 1, type: "Uint16"},
    {name: "a_seq", components:2, type: "Uint16"}
], 4);

export default layout;
export const {members, size, alignment} = layout;
