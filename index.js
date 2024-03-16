class Whatsapp {
    /*
     * Create a new Whatsapp instance.
     * 
     * @param {string} phoneNumberId - The phone number ID associated with the Whatsapp account.
     * @param {string} accessToken - The access token for accessing the Whatsapp API.
     * @param {string} [webhookVerifyToken=""] - The verification token for webhook endpoints (optional).
     * @param {string} [appVersion="v19.0"] - The version of the Whatsapp API to use (optional).
     */
    constructor(phoneNumberId, accessToken, webhookVerifyToken = "", appVersion = "v19.0") {
        this.phoneNumberId = phoneNumberId;
        this.accessToken = accessToken;
        this.webhookVerifyToken = webhookVerifyToken;
        this.appVersion = appVersion;
        this.baseUrl = `https://graph.facebook.com/${this.appVersion}/${this.phoneNumberId}`;
    };

    /*
     * Send a Whatsapp template message.
     * @param {string} to - The recipient's phone number.
     * @param {string} templateName - The name of the template to use.
     * @param {string} [language="en_US"] - The language code for the template (optional).
     * @param {Array} [header=[]] - An array of objects representing the header components of the template (optional).
     * @param {Array} [body=[]] - An array of objects representing the body components of the template (optional).
     * @param {Array} [buttons=[]] - An array of objects representing the button components of the template (optional).
     * @returns {Promise<Object|null>} - A promise resolving to the response object if successful, or null if an error occurs.
     */
    async sendTemplate(to, templateName, language = "en_US", header = [], body = [], buttons = []) {
        try {
            const url = `${this.baseUrl}/messages`;
            const components = [];
            const data = {
                "messaging_product": "whatsapp",
                "to": to,
                "type": "template",
                "template": {
                    "name": templateName,
                    "language": {
                        "code": language
                    }
                }
            };

            if (header.length > 0) {
                const headerComponent = {
                    "type": "header",
                    "parameters": header
                };
                components.push(headerComponent);
            }

            if (body.length > 0) {
                const bodyComponent = {
                    "type": "body",
                    "parameters": body
                };
                components.push(bodyComponent);
            }

            if (buttons.length > 0) {
                components.push(...buttons);
            }

            if (components.length > 0) {
                data['template']['components'] = components;
            }

            const response = await this.makeRequest(url, "POST", {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            }, JSON.stringify(data));

            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    /*
     * Send a Whatsapp text message.
     * @param {string} to - The recipient's phone number.
     * @param {string} message - The text message to send.
     * @returns {Promise<Object|null>} - A promise resolving to the response object if successful, or null if an error occurs.
     */
    async sendMessage(to, message) {
        try {
            const url = `${this.baseUrl}/messages`;
            const data = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": to,
                "type": "text",
                "text": {
                    "preview_url": false,
                    "body": message
                }
            };

            const response = await this.makeRequest(url, "POST", {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            }, JSON.stringify(data));

            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    /*
     * Send a Whatsapp image message.
     * @param {string} to - The recipient's phone number.
     * @param {string} media - The URL or ID of the image to send.
     * @param {string} [caption=""] - The caption for the image (optional).
     * @returns {Promise<Object|null>} - A promise resolving to the response object if successful, or null if an error occurs.
     */
    async sendImage(to, media, caption = "") {
        try {
            const url = `${this.baseUrl}/messages`;
            const data = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": to,
                "type": "image",
            };

            if (media.startsWith("http")) {
                data.image = { "link": media, "caption": caption };
            } else {
                data.image = { "id": media, "caption": caption };
            }

            const response = await this.makeRequest(url, "POST", {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            }, JSON.stringify(data));

            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    /*
     * Send a Whatsapp video message.
     * @param {string} to - The recipient's phone number.
     * @param {string} media - The URL or ID of the video to send.
     * @param {string} [caption=""] - The caption for the video (optional).
     * @returns {Promise<Object|null>} - A promise resolving to the response object if successful, or null if an error occurs.
     */
    async sendVideo(to, media, caption = "") {
        try {
            const url = `${this.baseUrl}/messages`;
            const data = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": to,
                "type": "video",
            };

            if (media.startsWith("http")) {
                data.video = { "link": media, "caption": caption };
            } else {
                data.video = { "id": media, "caption": caption };
            }

            const response = await this.makeRequest(url, "POST", {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            }, JSON.stringify(data));

            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    /*
     * Send a Whatsapp audio message.
     * @param {string} to - The recipient's phone number.
     * @param {string} media - The URL or ID of the audio file to send.
     * @returns {Promise<Object|null>} - A promise resolving to the response object if successful, or null if an error occurs.
     */
    async sendAudio(to, media) {
        try {
            const url = `${this.baseUrl}/messages`;
            const data = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": to,
                "type": "audio",
            };

            if (media.startsWith("http")) {
                data.audio = { "link": media };
            } else {
                data.audio = { "id": media };
            }

            const response = await this.makeRequest(url, "POST", {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            }, JSON.stringify(data));

            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    /*
     * Send a Whatsapp document message.
     * @param {string} to - The recipient's phone number.
     * @param {string} media - The URL or ID of the document to send.
     * @param {string} [caption=""] - The caption for the document (optional).
     * @param {string} [filename=""] - The filename of the document (optional).
     * @returns {Promise<Object|null>} - A promise resolving to the response object if successful, or null if an error occurs.
     */
    async sendDocument(to, media, caption = "", filename = "") {
        try {
            const url = `${this.baseUrl}/messages`;
            const data = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": to,
                "type": "document",
            };

            if (media.startsWith("http")) {
                data.document = { "link": media, "caption": caption, "filename": filename };
            } else {
                data.document = { "id": media, "caption": caption, "filename": filename };
            }

            const response = await this.makeRequest(url, "POST", {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            }, JSON.stringify(data));

            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    /*
     * Upload media to be used in Whatsapp messages.
     * @param {Object} file - The file object to upload.
     * @returns {Promise<Object|null>} - A promise resolving to the response object if successful, or null if an error occurs.
     */
    async uploadMedia(file) {
        try {
            const url = `${this.baseUrl}/media`;
            const formData = new FormData();
            formData.append('file', fs.createReadStream(file.path), {
                filename: file.filename,
                contentType: file.mimetype
            });
            formData.append('type', file.mimetype);
            formData.append('messaging_product', 'whatsapp');

            const response = await this.makeRequest(url, "POST", {
                'Authorization': `Bearer ${this.accessToken}`,
            }, formData);

            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    /*
     * Download media from Whatsapp messages.
     * @param {string} mediaId - The ID of the media to download.
     * @returns {Promise<Object|null>} - A promise resolving to the response object if successful, or null if an error occurs.
     */
    async downloadMedia(mediaId) {
        try {
            const url = `${this.baseUrl.replace(this.phoneNumberId, mediaId)}`;
            const response = await this.makeRequest(url, "GET", {
                'Authorization': `Bearer ${this.accessToken}`,
            });

            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    /*
     * Verify a Whatsapp webhook request.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     * @param {function} next - The next middleware function.
     */
    async verifyWebhook(req, res, next) {
        try {
            const hubMode = req.query['hub.mode'];
            const hubVerifyToken = req.query['hub.verify_token'];
            const hubChallenge = req.query['hub.challenge'];

            if (hubMode == 'subscribe' && hubVerifyToken == this.webhookVerifyToken) {
                res.status(200).send(hubChallenge);
            } else {
                res.sendStatus(400);
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    };

    /*
     * Make a HTTP request to the Whatsapp API.
     * @param {string} url - The URL of the API endpoint.
     * @param {string} method - The HTTP method (GET, POST, etc.).
     * @param {Object} headers - The HTTP headers.
     * @param {Object|null} data - The data to send in the request body (optional).
     * @returns {Promise<Response>} - A promise resolving to the response object.
     */
    async makeRequest(url, method, headers, data = null) {
        try {
            const requestOptions = {
                method: method,
                headers: headers
            };

            if (data) {
                requestOptions.body = data;
            }

            return await fetch(url, requestOptions);
        } catch (error) {
            return error;
        }
    };
};


module.exports = Whatsapp;