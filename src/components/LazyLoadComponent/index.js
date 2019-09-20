import Loadable from 'react-loadable';
import Loading from '../Loading'
import lazyLoad from 'lazy-load-component'

const lazyLoadComponent = (importComponent) => {
	if (process.env.NODE_ENV === 'production') {
		return Loadable({
			loader: importComponent,
			loading: Loading,
			delay: 300,
			timeout: 10000
		})
	}
	return lazyLoad(importComponent)
}
export default lazyLoadComponent
