import settings from '../settings';
import baseConfig from '../webpack.config';
import prodConfig from '../webpack.config.production';
import profileConfig from '../webpack.config.profile';

const NOW = '2023-03-28T16:07:07.909Z';

describe('webpack configs', () => {
    beforeAll(async() => {
        jest.spyOn(global.Date.prototype, 'toJSON').mockImplementation(() => NOW);
        await settings.init()
    });

    it('sets up the default config with default settings', () => {
        expect(new Date().toJSON()).toBe(NOW);
        const config = baseConfig(settings)
        expect(config).toMatchSnapshot()
    })

    it('sets up the production config with default settings', () => {
        const config = prodConfig(settings)
        expect(config).toMatchSnapshot()
    })

    it('sets up the profile config with default settings', () => {
        const config = profileConfig(settings)
        expect(config).toMatchSnapshot()
    })

})
