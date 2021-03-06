import 'mocha'
import { expect } from 'chai'
import { Channel, Playlist } from '../src'
import { youtube } from './cache.spec'

const apiKey = process.env.YOUTUBE_API_KEY

if (!apiKey) {
  throw new Error('No API key')
}

describe('Channels', () => {
  it('should reject if the channel isn\'t found', async () => {
    expect(await youtube.getChannel('QWERTRTRWEaVeryFakeChannelID').catch(error => { return error })).to.equal('Item not found')
  })

  it('should work with proper IDs', async () => {
    Channel.part = 'id,contentDetails,brandingSettings'
    expect(await youtube.getChannel('UCBR8-60-B28hp2BmDPdntcQ')).to.be.an.instanceOf(Channel)
  })

  it('should work with proper URLs', async () => {
    expect(await youtube.getChannel('https://www.youtube.com/channel/UCBR8-60-B28hp2BmDPdntcQ')).to.be.an.instanceOf(Channel)
  })

  it('should work with single searching', async () => {
    expect(await youtube.getChannel('youtube')).to.be.an.instanceOf(Channel)
  })

  it('should work with fetching', async () => {
    const channel = await youtube.getChannel('UCBR8-60-B28hp2BmDPdntcQ')
    expect(await channel.fetch()).to.be.an.instanceOf(Channel)
  })

  it('should work with fetching videos', async () => {
    const channel = await youtube.getChannel('UCBR8-60-B28hp2BmDPdntcQ')
    expect(await channel.fetchVideos()).to.be.an.instanceOf(Playlist)
  })

  it('should work with fetching playlists with maxResults', async () => {
    const channel = await youtube.getChannel('UCBR8-60-B28hp2BmDPdntcQ')
    expect((await channel.fetchPlaylists(5))[0]).to.be.an.instanceOf(Playlist)
  })

  it('should work with fetching playlists', async () => {
    Channel.part = 'id'

    const channel = await youtube.getChannel('UC6mi9rp7vRYninucP61qOjg')
    expect((await channel.fetchPlaylists())[0]).to.be.an.instanceOf(Playlist)
  })

  it('should have a negative subscriber count if it is hidden', async () => {
    Channel.part = 'statistics'

    const channel = await youtube.getChannel('UCacsMRrp9ql-vdgpn0zUIdQ')
    expect(channel.subCount).to.be.lessThan(0)
  })

  it('should contain branding properties', async () => {
    const channel = await youtube.getChannel('UCBR8-60-B28hp2BmDPdntcQ')

    expect(channel.banners).to.haveOwnProperty('bannerImageUrl')
    expect(channel.keywords.length).to.be.greaterThan(0)
    expect(channel.featuredChannels.length).to.be.greaterThan(0)
  })
})
