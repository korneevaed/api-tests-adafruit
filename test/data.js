import test from 'ava';
import {
    getApi,
    auth,
    logout,
    createFeed,
    responseErrMessage as err
} from './helpers/shortcuts';

test.before('Create feed', async t => {
    // Authorise
    t.context.api = await getApi();
    auth(t.context.api);

    // Create feed
    const feedObject = { name: 'autotest-feed-with-data', description: 'feed generated by api autotest with data'};
    t.context.feed = await createFeed(t, t.context.api, feedObject);
});

test.beforeEach('Authorise', async t => {
    t.context.api = await getApi();
    auth(t.context.api);
});

test('Add data to feed works', async t => {
    const data = { value: 42 };
    const respData = await t.context.api.post(`/feeds/${t.context.feed.key}/data`, data);
    t.is(respData.status, 200, err(respData));
    t.is(respData.data.value, data.value.toString());
    t.is(respData.data.feed_key, t.context.feed.key);
});

// Serial because logout influences parallel tests otherwise
test.serial('Add data to feed fails without auth token', async t => {
    logout(t.context.api);

    const data = { value: 42 };
    const respData = await t.context.api.post(`/feeds/${t.context.feed.key}/data`, data);
    t.is(respData.status, 404, err(respData));
});