import Aergo, { GrpcWebProvider } from '@herajs/client'

function connectAergo(url) {
    const provider = new GrpcWebProvider(url)
    return new Aergo({}, provider)
}

export default connectAergo
