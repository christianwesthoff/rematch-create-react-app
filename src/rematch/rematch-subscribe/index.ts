import subscribeMiddleware from './middleware/subscribe';
import { Plugin } from '@rematch/core';

export default (): Plugin => {
	return {
		middleware: subscribeMiddleware
	}
}