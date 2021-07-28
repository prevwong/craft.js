const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');
const Enzyme = require('enzyme');

Enzyme.configure({ adapter: new Adapter() });

jest.spyOn(console, 'error').mockImplementation(() => {});
