/**
 * (C) 2020 TekMonks. All rights reserved.
 * License: See enclosed LICENSE file.
 */
import {session} from "/framework/js/session.mjs";
import {apimanager as apiman} from "./../../../framework/js/apimanager.mjs";

const _app = {init: _init};

async function _init() {
    const API_KEYS = {"*":"fheiwu98237hjief8923ydewjidw834284hwqdnejwr79389"}, KEY_HEADER = "X-API-Key";
    apiman.registerAPIKeys(API_KEYS, KEY_HEADER);

    _app.session = session;
    _app.apiman = apiman;
    _app.APP_ROOT = new URL("../",import.meta.url);
    _app.url = new URL(window.location.href).toString();
    _app.importJSON = async path => await(await fetch(path)).json();
    _app.conf = await _app.importJSON(`${_app.APP_ROOT.href}/conf/xtrack.json`);
    _app.BACKEND = `${_app.conf.BACKEND||`${_app.APP_ROOT.protocol}//${_app.APP_ROOT.hostname}:9990`}/apps/xtrack`;
}

export const app = _app;