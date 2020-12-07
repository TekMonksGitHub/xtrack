/**
 * (C) 2020 TekMonks. All rights reserved.
 * License: See enclosed LICENSE file.
 */
import {app} from "./lib/application.mjs";

async function pushEvents() {
    const campaigns = await app.importJSON(`${app.APP_ROOT}/conf/campaigns.json`);
    const currentURL = new URL(window.location.href).toString();
    let clientIP = await (await fetch("https://www.cloudflare.com/cdn-cgi/trace")).text();
    clientIP = clientIP.match(/[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/)[0];
    
    for (const audience of campaigns.audience) {
        if (_evalRule(audience.refinement)==true) {
            const pubEvent = await _publishEvent(audience.event_name, audience.targets, currentURL, clientIP, navigator.userAgent);
            //const pubAd = await _publishAds(_findAds(audience.id, campaigns.ads), currentURL);
            if (pubEvent && pubEvent.result) console.log("Audience published");
            //if (pubAd && pubAd.result) console.log("Ad published");
        }
    }
}

function addProperty(name, obj) {
    const xtObjects = app.session.get("__xt_objects") || {};
    xtObjects[name] = obj;
    app.session.set("__xt_objects", xtObjects);
}

function _evalRule(rule) {
    const xtObjects = app.session.get("__xt_objects") || {};
    for (const key of Object.keys(xtObjects)) __xt[key] = xtObjects[key];
    return window.eval(rule);
}

const _findAds = (audienceID, ads) => ads.filter(ad => ad.audience.includes(audienceID));
const _publishEvent = async (name, targets, url, ip, ua) => await app.apiman.rest(`${app.BACKEND}/publishEvents`, "POST", 
    {name, targets, url, ip, ua});
const _publishAds = async (ads, url) => await app.apiman.rest(`${app.BACKEND}/publishAds`, "POST", {ads, url});

(async _ => {await app.init(); window.__xt = app; pushEvents();})();
export const xtrack = {addProperty, pushEvents};