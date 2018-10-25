'use strict'

import v from './v1'

export default app => {
  app.use('/v', v)
}
