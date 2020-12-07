/** 
 * Publishes the given ads to the given networks.
 * 
 * (C) 2020 TekMonks. All rights reserved.
 */


exports.doService = async jsonReq => {
	if (!validateRequest(jsonReq)) {LOG.error("Validation failure."); return CONSTANTS.FALSE_RESULT;}
}

const validateRequest = jsonReq => jsonReq && jsonReq.ads && jsonReq.url;