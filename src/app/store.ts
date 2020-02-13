import { init } from '@rematch/core'
import { RematchRootDispatch, RematchRootState } from 'extensions/util'
import * as models from 'models'
import immerPlugin from '@rematch/immer'
import selectPlugin from '@rematch/select'
import queryPlugin from 'extensions/rematchQuery'

export const store = init({
	models,
	plugins: [immerPlugin(), selectPlugin()],
});

export type RootState = RematchRootState<typeof models>

export type RootDispatch = RematchRootDispatch<typeof models>;

export default store;