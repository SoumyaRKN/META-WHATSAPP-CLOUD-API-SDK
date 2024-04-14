const fs = require('fs');
const path = require('path');

class Whatsapp {
    /**
     * Create a new Whatsapp instance.
     * @param {String} phoneNumberId - The phone number ID associated with the Whatsapp account.
     * @param {String} accessToken - The access token for accessing the Whatsapp API.
     * @param {String} [appVersion="v19.0"] - The version of the Whatsapp API to use (optional).
     * @param {String} [accountId=""] - The whatsapp buseness account Id of the Whatsapp API to use (optional).
     * @param {String} [appId=""] - The whatsapp buseness app Id of the Whatsapp API to use (optional).
     * @param {String} [webhookVerifyToken=""] - The verification token for webhook endpoints (optional).
     */
    constructor(phoneNumberId, accessToken, appVersion = "v19.0", accountId = "", appId = "", webhookVerifyToken = "") {
        this.phoneNumberId = phoneNumberId;
        this.accessToken = accessToken;
        this.appVersion = appVersion;
        this.accountId = accountId;
        this.appId = appId;
        this.webhookVerifyToken = webhookVerifyToken;
        this.baseUrl = `https://graph.facebook.com/${this.appVersion}/${this.phoneNumberId}`;
    };

    /**
     * Make a HTTP request to the Whatsapp API.
     * @param {String} url - The URL of the API endpoint.
     * @param {String} method - The HTTP method (GET, POST, etc.).
     * @param {Object|null} headers - The HTTP headers (optional).
     * @param {String|Object|null} data - The data to send in the request body (optional).
     * @returns {Promise<Response>} - A promise resolving to the response object.
     */
    async makeRequest(url, method, headers = null, data = null) {
        try {
            const requestOptions = { method };

            if (headers) {
                requestOptions.headers = headers;
            }

            if (data) {
                requestOptions.body = data;
            }

            return await fetch(url, requestOptions);
        } catch (error) {
            return error;
        }
    };

    /**
     * Send a Whatsapp template message.
     * @param {String} to - The recipient's phone number.
     * @param {String} templateName - The name of the template to use.
     * @param {String} [language="en_US"] - The language code for the template (optional).
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

    /**
     * Send a Whatsapp text message.
     * @param {String} to - The recipient's phone number.
     * @param {String} message - The text message to send.
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

    /**
     * Send a Whatsapp image message.
     * @param {String} to - The recipient's phone number.
     * @param {String} media - The URL or ID of the image to send.
     * @param {String} [caption=""] - The caption for the image (optional).
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

    /**
     * Send a Whatsapp video message.
     * @param {String} to - The recipient's phone number.
     * @param {String} media - The URL or ID of the video to send.
     * @param {String} [caption=""] - The caption for the video (optional).
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

    /**
     * Send a Whatsapp audio message.
     * @param {String} to - The recipient's phone number.
     * @param {String} media - The URL or ID of the audio file to send.
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

    /**
     * Send a Whatsapp document message.
     * @param {String} to - The recipient's phone number.
     * @param {String} media - The URL or ID of the document to send.
     * @param {String} [caption=""] - The caption for the document (optional).
     * @param {String} [filename=""] - The filename of the document (optional).
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

    /**
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

    /**
     * Download media from Whatsapp messages.
     * @param {String} mediaId - The ID of the media to download.
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

    /**
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

    /**
     * Register template in your meta whatsapp app.
     * @param {String} name  Template name (Maximum 512 characters. naming convention should be only in lowercase and underscore).
     * @param {Array of Objects} components  Components that make up the template. Reffer : https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/#template-components
     * @param {String} [category="UTILITY"]  Template category (Allowed values : UTILITY, MARKETING, AUTHENTICATION).
     * @param {Boolean} [allowCategoryChange=false]  Set to true to allow META to automatically assign a category.
     * @param {String} [language="en_US"]  Template language code.
     * @returns {Promise<Object|null>} - A promise resolving to the response object if successful, or null if an error occurs.
     */
    async registerTemplate(name, components, category = "UTILITY", allowCategoryChange = false, language = "en_US") {
        try {
            const url = `${this.baseUrl.replace(this.phoneNumberId, this.accountId)}/message_templates`;
            const data = {
                "name": name,
                "category": category.toUpperCase(),
                "allow_category_change": allowCategoryChange,
                "language": language,
                "components": components
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

    /**
     * Get a list of templates owned by the WhatsApp Business Account.
     * @param {String} [query=""]  Filter templates by field, (Example : status=REJECTED).
     * @param {String} [fields="name,status"]  List of template fields you want returned.
     * @param {Number} [limit=0]  The maximum number of templates you want returned in each page of results.
     * @returns {Promise<Object|null>} - A promise resolving to the response object if successful, or null if an error occurs.
     */
    async getTemplates(query = "", fields = "name,status", limit = 0) {
        try {
            const url = `${this.baseUrl.replace(this.phoneNumberId, this.accountId)}/message_templates?fields=${fields}${query ? `&${query}` : ""}${limit ? `&limit=${limit}` : ""}`;

            const response = await this.makeRequest(url, "GET", {
                'Authorization': `Bearer ${this.accessToken}`,
            });

            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    /**
     * Get a particular template information owned by the WhatsApp Business Account.
     * @param {String} templateId Whatsapp message template id.
     * @returns {Promise<Object|null>} - A promise resolving to the response object if successful, or null if an error occurs.
     */
    async getTemplateInfo(templateId) {
        try {
            const url = `${this.baseUrl.replace(this.phoneNumberId, templateId)}?access_token=${this.accessToken}`;

            const response = await this.makeRequest(url, "GET");

            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    /**
     * Update template in your meta whatsapp app.
     * @param {String} templateId Whatsapp message template id.
     * @param {String} [category="UTILITY"]  Template category (Allowed values : UTILITY, MARKETING, AUTHENTICATION).
     * @param {Array of Objects} [components=[]]  Components that make up the template. Reffer : https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/#template-components
     * @returns {Promise<Object|null>} - A promise resolving to the response object if successful, or null if an error occurs.
     */
    async updateTemplate(templateId, category = "UTILITY", components = []) {
        try {
            const url = `${this.baseUrl.replace(this.phoneNumberId, templateId)}`;
            const data = {
                "category": category.toUpperCase(),
            };

            if (components.length > 0) {
                data.components = components;
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

    /**
     * Delete template in your meta whatsapp app.
     * @param {String} name  Whatsapp message template name.
     * @param {String} [templateId=""] Whatsapp message template id (Optional, Required if you wish to delete a template by ID).
     * @returns {Promise<Object|null>} - A promise resolving to the response object if successful, or null if an error occurs.
     */
    async deleteTemplate(name, templateId = "") {
        try {
            const url = `${this.baseUrl.replace(this.phoneNumberId, this.accountId)}/message_templates?${templateId ? `hsm_id=${templateId}&name=${name}` : `name=${name}`}`;

            const response = await this.makeRequest(url, "DELETE", {
                'Authorization': `Bearer ${this.accessToken}`
            });

            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    /**
     * Validate whatsApp account users/contacts
     * @param {Array of Strings} contacts  Array of phone numbers that you wish to Validate.
     * @param {Boolean} [blocking=false]  Whether the request should wait for processing to complete or not before returning a response.
     * @param {Boolean} [forceCheck=false]  Whether to check the contacts cache or not.
     * @returns {Promise<Object|null>} - A promise resolving to the response object if successful, or null if an error occurs.
     */
    /*
    async validateContacts(contacts, blocking = false, forceCheck = false) {
        try {
            const url = `${this.baseUrl.replace(this.phoneNumberId, "")}v1/contacts`;
            const data = {
                "blocking": blocking ? "wait" : "no_wait",
                "contacts": contacts,
                "force_check": forceCheck,
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
    */

    /**
     * 
     * @param {Object} file - The file object to upload.
     * @param {*} [fileOffset=0] - An integer that indicates the number of bytes that have been successfully uploaded Default 0.
     * @returns {Promise<Object|null>} - A promise resolving to the response object if successful, or null if an error occurs.
     */
    async resumableUpload(file, fileOffset = 0) {
        try {
            const sessionUrl = `${this.baseUrl.replace(this.phoneNumberId, this.appId)}/uploads?file_length=${file.size}&file_type=${file.mimetype}&access_token=${this.accessToken}`;
            const sessionResponse = await this.makeRequest(sessionUrl, "POST");
            const sessionResponseJson = await sessionResponse.json();
            const sessionId = sessionResponseJson?.id;

            if (!sessionId) {
                return null;
            }

            const uploadUrl = `${this.baseUrl.replace(this.phoneNumberId, sessionId)}`;
            const formData = new FormData();
            formData.append('file', fs.readFileSync(path.resolve(file.path)).toString("utf8"));

            const uploadResponse = await this.makeRequest(uploadUrl, "POST", {
                'Authorization': `OAuth ${this.accessToken}`,
                'file_offset': fileOffset,
                'Content-Type': 'application/x-www-form-urlencoded',
            }, formData);

            return await uploadResponse.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };
};


module.exports = Whatsapp;