/**
 * MyBCABus
 * 
 * @desc    MyBCABus refactored to be more efficient and maintainable.
 *          IE (both mobile and desktop) and Opera mobile do not support the Fetch API.
 * @since   1.0
 * @version 1.2
 * @author  Sam Olaogun
 */
'use strict';

import MyBCABus from './MyBCABus';
import './index.css';

window.addEventListener('DOMContentLoaded', () => new MyBCABus);