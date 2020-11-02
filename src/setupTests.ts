import Adapter from 'enzyme-adapter-react-16'
import Enzyme from 'enzyme'

Enzyme.configure({ adapter: new Adapter() })

Object.defineProperty(window, 'matchMedia', {
	value: jest.fn().mockImplementation(query => ({
		addEventListener: jest.fn(),
		addListener: jest.fn(), // deprecated
		dispatchEvent: jest.fn(),
		matches: false,
		media: query,
		onchange: null,
		removeEventListener: jest.fn(),
		removeListener: jest.fn() // deprecated
	})),
	writable: true
})
