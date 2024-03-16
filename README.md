# META-WHATSAPP-CLOUD-API-SDK
This Node.js SDK provides functionalities to interact with the WhatsApp Cloud Business API, including sending templates, messages, attachments, uploading media, and verifying webhooks.

## Installation
1. Install the package in your project.
```
npm i meta-whatsapp-cloud-api-sdk
```

2. Require the package in your project.

```
const Whatsapp = require('meta-whatsapp-cloud-api-sdk');
```

## Usage

### Initialization
```
// Provide Phone Number ID, Access Token, Webhook Verify Token, and Meta App Version.

const phoneNumberId = "your_phone_number_id";
const accessToken = "your_access_token";
const webhookVerifyToken = "your_webhook_verify_token"; // Optional, Add this if you wish to use Webhook
const appVersion = "your_app_version"; // Optional, Default version is v19.0

const whatsapp = new Whatsapp(phoneNumberId, accessToken, webhookVerifyToken, appVersion);

```

### Sending Templates
```
// Example header
const header = [
    {
        type: "image",
        image: {
            link: "URL"
        }
    },
    {
        type: "location",
        location: {
            latitude: "<LATITUDE>",
            longitude: "<LONGITUDE>",
            name: "<NAME>",
            address: "<ADDRESS>"
        }
    }
];

// Example body
const body = [
    {
        type: "text",
        text: "TEXT-STRING"
    },
    {
        type: "currency",
        currency: {
            fallback_value: "VALUE",
            code: "USD",
            amount_1000: NUMBER
        }
    },
    {
        type: "date_time",
        date_time: {
            fallback_value: "MONTH DAY, YEAR"
        }
    }
];

// Example buttons
const buttons = [
    {
        type: "button",
        sub_type: "quick_reply",
        index: "0",
        parameters: [
            {
                type: "payload",
                payload: "PAYLOAD"
            }
        ]
    },
    {
        type: "button",
        sub_type: "quick_reply",
        index: "1",
        parameters: [
            {
                type: "payload",
                payload: "PAYLOAD"
            }
        ]
    }
];

// Send a template message (async/await) - header, body and buttons parameters are optional
const response = await whatsapp.sendTemplate(to, templateName, language, header, body, buttons);

Or

// Send a template message (promise) - header, body and buttons parameters are optional
whatsapp.sendTemplate(to, templateName, language, header, body, buttons)
.then((response)=>{
    console.log(response);
}).catch((error)=>{
    console.log(error);
});
```

### Sending Messages
```
// Send a text message (async/await)
const response = await whatsapp.sendMessage(to, message);

Or

// Send a text message (promise)
whatsapp.sendMessage(to, message)
.then((response)=>{
    console.log(response);
}).catch((error)=>{
    console.log(error);
});
```

### Sending Image
```
// Upload media (async/await)
const media = await whatsapp.uploadMedia(file);

// Send an image message (async/await) - 2nd Parameter is Media Id or Media Link
const response = await whatsapp.sendImage(to, media.id, caption);

Or

// Upload media (promise)
whatsapp.uploadMedia(file)
.then((media)=>{
    // Send an image message (promise) - 2nd Parameter is Media Id or Media Link
    whatsapp.sendImage(to, media.id, caption)
    .then((response)=>{
        console.log(response);
    }).catch((error)=>{
        console.log(error);
    });
}).catch((error)=>{
    console.log(error);
});
```

### Sending Video
```
// Upload media (async/await)
const media = await whatsapp.uploadMedia(file);

// Send a video message (async/await) - 2nd Parameter is Media Id or Media Link
const response = await whatsapp.sendVideo(to, media.id, caption);

Or

// Upload media (promise)
whatsapp.uploadMedia(file)
.then((media)=>{
    // Send a video message (promise) - 2nd Parameter is Media Id or Media Link
    whatsapp.sendVideo(to, media.id, caption)
    .then((response)=>{
        console.log(response);
    }).catch((error)=>{
        console.log(error);
    });
}).catch((error)=>{
    console.log(error);
});
```

### Sending Audio
```
// Upload media (async/await)
const media = await whatsapp.uploadMedia(file);

// Send an audio message (async/await) - 2nd Parameter is Media Id or Media Link
const response = await whatsapp.sendAudio(to, media.id);

Or

// Upload media (promise)
whatsapp.uploadMedia(file)
.then((media)=>{
    // Send an audio message (promise) - 2nd Parameter is Media Id or Media Link
    whatsapp.sendAudio(to, media.id)
    .then((response)=>{
        console.log(response);
    }).catch((error)=>{
        console.log(error);
    });
}).catch((error)=>{
    console.log(error);
});
```

### Sending Document
```
// Upload media (async/await)
const media = await whatsapp.uploadMedia(file);

// Send a document message (async/await) - 2nd Parameter is Media Id or Media Link
const response = await whatsapp.sendDocument(to, media.id, caption, filename);

Or

// Upload media (promise)
whatsapp.uploadMedia(file)
.then((media)=>{
    // Send a document message (promise) - 2nd Parameter is Media Id or Media Link
    whatsapp.sendDocument(to, media.id, caption, filename)
    .then((response)=>{
        console.log(response);
    }).catch((error)=>{
        console.log(error);
    });
}).catch((error)=>{
    console.log(error);
});
```

### Download Media
```
// Download media (async/await)
const response = await whatsapp.downloadMedia(mediaId);

Or

// Download media (promise)
whatsapp.downloadMedia(mediaId)
.then((response)=>{
    console.log(response);
}).catch((error)=>{
    console.log(error);
});
```

### Webhook
```
// Verify webhook endpoint (Express.js example)
app.get("/webhook", whatsapp.verifyWebhook);
```