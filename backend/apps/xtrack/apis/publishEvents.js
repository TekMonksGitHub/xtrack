/** 
 * Publishes the given event to the given networks.
 * 
 * (C) 2020 TekMonks. All rights reserved.
 */
const querystring = require("querystring");
const {postHttps} = require(`${CONSTANTS.LIBDIR}/rest.js`);
const conf = require(`${APP_CONSTANTS.CONF_DIR}/ad_networks.json`);

exports.doService = async jsonReq => {
	if (!validateRequest(jsonReq)) {LOG.error("Validation failure."); return CONSTANTS.FALSE_RESULT;}

	const fbEvent = [{event_name: jsonReq.name, event_time: Math.floor(Date.now() / 1000), action_source:"website", 
		event_source_url: jsonReq.url, user_data: {client_ip_address:jsonReq.ip||"", client_user_agent: jsonReq.ua||""}}];
	const query = querystring.stringify({data:JSON.stringify(fbEvent)}) + `&access_token=${conf.fbToken}`;

	const fbResult = await postHttps("graph.facebook.com", 443, `/v9.0/${conf.fbPixel}/events?${query}`, {}, "");

	if (fbResult && fbResult.data && fbResult.data.events_received) return CONSTANTS.TRUE_RESULT; 
	else return CONSTANTS.FALSE_RESULT
}

const validateRequest = jsonReq => jsonReq && jsonReq.name && jsonReq.targets && jsonReq.url;