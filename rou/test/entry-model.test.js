import test from 'node:test';
import assert from 'node:assert/strict';
import {editEntry} from '../client/entry-model.js';
test('keyboard supports mixed-case names, email punctuation and every printable password character',()=>{
  let s={value:'',caret:0};
  const text=`Zoë O'Neil-2 <name+tag@example.test> !@#$%^&*()_+[]{}\\|;:'",.<>/?\`~`;
  for(const key of text)s=editEntry(s.value,s.caret,key,128);
  assert.equal(s.value,text);
});
test('cursor edits preserve Unicode characters and password length limits',()=>{
  let s=editEntry('A😀é',2,'Backspace',128);assert.deepEqual(s,{value:'Aé',caret:1});
  s=editEntry(s.value,s.caret,'-',128);assert.deepEqual(s,{value:'A-é',caret:2});
  assert.deepEqual(editEntry(s.value,0,'Left'),{value:'A-é',caret:0});
  assert.equal(editEntry(s.value,1,'xyz',3).value,'A-é');
  assert.equal(editEntry(s.value,1,'Delete').value,'Aé');
  assert.deepEqual(editEntry(s.value,3,'Clear'),{value:'',caret:0});
});
