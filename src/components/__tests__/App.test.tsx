import App from 'components/App'
import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

let wrapper: ShallowWrapper

beforeEach(() => {
	wrapper = shallow(<App />)
})

it('renders Hello World', () => {
	expect(wrapper.text()).toEqual('Hello World')
})
