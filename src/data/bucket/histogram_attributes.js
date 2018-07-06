/*
 * @Description:  
 * @Author: liuchen@hiynn.com 
 * @Date: 2018-06-22 10:54:31 
 * @Last Modified by:   liuchen 
 * @Last Modified time: 2018-06-22 10:54:31 
 */
// @flow
import { createLayout } from '../../util/struct_array';

const layout = createLayout([
    {name: 'a_pos',          components: 2, type: 'Int16'},
    {name: 'a_normal_ed',    components: 4, type: 'Int16'},
], 4);

export default layout;
export const {members, size, alignment} = layout;
