import { shallow } from 'enzyme';
import React from 'react';
import { MyButton } from '../pages/components';

describe('Button', () => {

  it('calls specified function when clicked', () => {
    const handleClick = jest.fn();
    shallow(<MyButton onClick={ handleClick } />).simulate('click');
    expect(handleClick).toHaveBeenCalledTimes(1);
  })

  it('uses a custom text', () => {
    const text = 'Submit';
    const comp = shallow(<MyButton>{ text }</MyButton>);
    expect(comp.text()).toBe(text);
  })




})