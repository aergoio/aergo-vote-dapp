import Aergo, { GrpcWebProvider } from '@herajs/client'

const provider = new GrpcWebProvider({url: 'http://localhost:17845'})
const aergo = new Aergo({}, provider)

export default aergo
