import {describe,expect,it} from 'vitest';
import {directionForKey} from '../src/keyboard';
describe('keyboard paddle direction (positive world Y = visual up)',()=>{
 it('ArrowUp raises the paddle',()=>expect(directionForKey('ArrowUp')).toBe(1));
 it('ArrowDown lowers the paddle',()=>expect(directionForKey('ArrowDown')).toBe(-1));
 it('supports horizontal directional band fallback',()=>{expect(directionForKey('ArrowLeft')).toBe(1);expect(directionForKey('ArrowRight')).toBe(-1);});
 it('ignores unrelated keys',()=>expect(directionForKey('Enter')).toBeNull());
});
