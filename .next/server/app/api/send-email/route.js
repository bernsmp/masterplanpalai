(()=>{var a={};a.id=607,a.ids=[607],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},96384:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>W,patchFetch:()=>V,routeModule:()=>R,serverHooks:()=>U,workAsyncStorage:()=>S,workUnitAsyncStorage:()=>T});var d={};c.r(d),c.d(d,{POST:()=>Q});var e=c(95736),f=c(9117),g=c(4044),h=c(39326),i=c(32324),j=c(261),k=c(54290),l=c(85328),m=c(38928),n=c(46595),o=c(3421),p=c(17679),q=c(41681),r=c(63446),s=c(86439),t=c(51356),u=Object.defineProperty,v=Object.defineProperties,w=Object.getOwnPropertyDescriptors,x=Object.getOwnPropertySymbols,y=Object.prototype.hasOwnProperty,z=Object.prototype.propertyIsEnumerable,A=(a,b,c)=>b in a?u(a,b,{enumerable:!0,configurable:!0,writable:!0,value:c}):a[b]=c,B=(a,b)=>{for(var c in b||(b={}))y.call(b,c)&&A(a,c,b[c]);if(x)for(var c of x(b))z.call(b,c)&&A(a,c,b[c]);return a},C=(a,b,c)=>new Promise((d,e)=>{var f=a=>{try{h(c.next(a))}catch(a){e(a)}},g=a=>{try{h(c.throw(a))}catch(a){e(a)}},h=a=>a.done?d(a.value):Promise.resolve(a.value).then(f,g);h((c=c.apply(a,b)).next())}),D=class{constructor(a){this.resend=a}create(a){return C(this,arguments,function*(a,b={}){return yield this.resend.post("/api-keys",a,b)})}list(){return C(this,null,function*(){return yield this.resend.get("/api-keys")})}remove(a){return C(this,null,function*(){return yield this.resend.delete(`/api-keys/${a}`)})}},E=class{constructor(a){this.resend=a}create(a){return C(this,arguments,function*(a,b={}){return yield this.resend.post("/audiences",a,b)})}list(){return C(this,null,function*(){return yield this.resend.get("/audiences")})}get(a){return C(this,null,function*(){return yield this.resend.get(`/audiences/${a}`)})}remove(a){return C(this,null,function*(){return yield this.resend.delete(`/audiences/${a}`)})}};function F(a){var b;return{attachments:null==(b=a.attachments)?void 0:b.map(a=>({content:a.content,filename:a.filename,path:a.path,content_type:a.contentType,content_id:a.contentId})),bcc:a.bcc,cc:a.cc,from:a.from,headers:a.headers,html:a.html,reply_to:a.replyTo,scheduled_at:a.scheduledAt,subject:a.subject,tags:a.tags,text:a.text,to:a.to}}var G=class{constructor(a){this.resend=a}send(a){return C(this,arguments,function*(a,b={}){return this.create(a,b)})}create(a){return C(this,arguments,function*(a,b={}){let d=[];for(let b of a){if(b.react){if(!this.renderAsync)try{let{renderAsync:a}=yield c.e(762).then(c.t.bind(c,81762,19));this.renderAsync=a}catch(a){throw Error("Failed to render React component. Make sure to install `@react-email/render`")}b.html=yield this.renderAsync(b.react),b.react=void 0}d.push(F(b))}return yield this.resend.post("/emails/batch",d,b)})}},H=class{constructor(a){this.resend=a}create(a){return C(this,arguments,function*(a,b={}){if(a.react){if(!this.renderAsync)try{let{renderAsync:a}=yield c.e(762).then(c.t.bind(c,81762,19));this.renderAsync=a}catch(a){throw Error("Failed to render React component. Make sure to install `@react-email/render`")}a.html=yield this.renderAsync(a.react)}return yield this.resend.post("/broadcasts",{name:a.name,audience_id:a.audienceId,preview_text:a.previewText,from:a.from,html:a.html,reply_to:a.replyTo,subject:a.subject,text:a.text},b)})}send(a,b){return C(this,null,function*(){return yield this.resend.post(`/broadcasts/${a}/send`,{scheduled_at:null==b?void 0:b.scheduledAt})})}list(){return C(this,null,function*(){return yield this.resend.get("/broadcasts")})}get(a){return C(this,null,function*(){return yield this.resend.get(`/broadcasts/${a}`)})}remove(a){return C(this,null,function*(){return yield this.resend.delete(`/broadcasts/${a}`)})}update(a,b){return C(this,null,function*(){return yield this.resend.patch(`/broadcasts/${a}`,{name:b.name,audience_id:b.audienceId,from:b.from,html:b.html,text:b.text,subject:b.subject,reply_to:b.replyTo,preview_text:b.previewText})})}},I=class{constructor(a){this.resend=a}create(a){return C(this,arguments,function*(a,b={}){return yield this.resend.post(`/audiences/${a.audienceId}/contacts`,{unsubscribed:a.unsubscribed,email:a.email,first_name:a.firstName,last_name:a.lastName},b)})}list(a){return C(this,null,function*(){return yield this.resend.get(`/audiences/${a.audienceId}/contacts`)})}get(a){return C(this,null,function*(){return a.id||a.email?yield this.resend.get(`/audiences/${a.audienceId}/contacts/${(null==a?void 0:a.email)?null==a?void 0:a.email:null==a?void 0:a.id}`):{data:null,error:{message:"Missing `id` or `email` field.",name:"missing_required_field"}}})}update(a){return C(this,null,function*(){return a.id||a.email?yield this.resend.patch(`/audiences/${a.audienceId}/contacts/${(null==a?void 0:a.email)?null==a?void 0:a.email:null==a?void 0:a.id}`,{unsubscribed:a.unsubscribed,first_name:a.firstName,last_name:a.lastName}):{data:null,error:{message:"Missing `id` or `email` field.",name:"missing_required_field"}}})}remove(a){return C(this,null,function*(){return a.id||a.email?yield this.resend.delete(`/audiences/${a.audienceId}/contacts/${(null==a?void 0:a.email)?null==a?void 0:a.email:null==a?void 0:a.id}`):{data:null,error:{message:"Missing `id` or `email` field.",name:"missing_required_field"}}})}},J=class{constructor(a){this.resend=a}create(a){return C(this,arguments,function*(a,b={}){return yield this.resend.post("/domains",{name:a.name,region:a.region,custom_return_path:a.customReturnPath},b)})}list(){return C(this,null,function*(){return yield this.resend.get("/domains")})}get(a){return C(this,null,function*(){return yield this.resend.get(`/domains/${a}`)})}update(a){return C(this,null,function*(){return yield this.resend.patch(`/domains/${a.id}`,{click_tracking:a.clickTracking,open_tracking:a.openTracking,tls:a.tls})})}remove(a){return C(this,null,function*(){return yield this.resend.delete(`/domains/${a}`)})}verify(a){return C(this,null,function*(){return yield this.resend.post(`/domains/${a}/verify`)})}},K=class{constructor(a){this.resend=a}send(a){return C(this,arguments,function*(a,b={}){return this.create(a,b)})}create(a){return C(this,arguments,function*(a,b={}){if(a.react){if(!this.renderAsync)try{let{renderAsync:a}=yield c.e(762).then(c.t.bind(c,81762,19));this.renderAsync=a}catch(a){throw Error("Failed to render React component. Make sure to install `@react-email/render`")}a.html=yield this.renderAsync(a.react)}return yield this.resend.post("/emails",F(a),b)})}get(a){return C(this,null,function*(){return yield this.resend.get(`/emails/${a}`)})}update(a){return C(this,null,function*(){return yield this.resend.patch(`/emails/${a.id}`,{scheduled_at:a.scheduledAt})})}cancel(a){return C(this,null,function*(){return yield this.resend.post(`/emails/${a}/cancel`)})}},L="undefined"!=typeof process&&process.env&&process.env.RESEND_BASE_URL||"https://api.resend.com",M="undefined"!=typeof process&&process.env&&process.env.RESEND_USER_AGENT||"resend-node:6.0.2",N=class{constructor(a){if(this.key=a,this.apiKeys=new D(this),this.audiences=new E(this),this.batch=new G(this),this.broadcasts=new H(this),this.contacts=new I(this),this.domains=new J(this),this.emails=new K(this),!a&&("undefined"!=typeof process&&process.env&&(this.key=process.env.RESEND_API_KEY),!this.key))throw Error('Missing API key. Pass it to the constructor `new Resend("re_123")`');this.headers=new Headers({Authorization:`Bearer ${this.key}`,"User-Agent":M,"Content-Type":"application/json"})}fetchRequest(a){return C(this,arguments,function*(a,b={}){try{let c=yield fetch(`${L}${a}`,b);if(!c.ok)try{let a=yield c.text();return{data:null,error:JSON.parse(a)}}catch(b){if(b instanceof SyntaxError)return{data:null,error:{name:"application_error",message:"Internal server error. We are unable to process your request right now, please try again later."}};let a={message:c.statusText,name:"application_error"};if(b instanceof Error){let c,d;return{data:null,error:(c=B({},a),d={message:b.message},v(c,w(d)))}}return{data:null,error:a}}return{data:yield c.json(),error:null}}catch(a){return{data:null,error:{name:"application_error",message:"Unable to fetch data. The request could not be resolved."}}}})}post(a,b){return C(this,arguments,function*(a,b,c={}){let d=new Headers(this.headers);c.idempotencyKey&&d.set("Idempotency-Key",c.idempotencyKey);let e=B({method:"POST",headers:d,body:JSON.stringify(b)},c);return this.fetchRequest(a,e)})}get(a){return C(this,arguments,function*(a,b={}){let c=B({method:"GET",headers:this.headers},b);return this.fetchRequest(a,c)})}put(a,b){return C(this,arguments,function*(a,b,c={}){let d=B({method:"PUT",headers:this.headers,body:JSON.stringify(b)},c);return this.fetchRequest(a,d)})}patch(a,b){return C(this,arguments,function*(a,b,c={}){let d=B({method:"PATCH",headers:this.headers,body:JSON.stringify(b)},c);return this.fetchRequest(a,d)})}delete(a,b){return C(this,null,function*(){let c={method:"DELETE",headers:this.headers,body:JSON.stringify(b)};return this.fetchRequest(a,c)})}},O=c(10641);let P=new N(process.env.RESEND_API_KEY);async function Q(a){try{let{to:b,eventName:c,date:d,time:e,location:f,venue:g,shareCode:h,organizerName:i}=await a.json();if(!b||!c||!d||!e||!h)return O.NextResponse.json({error:"Missing required fields"},{status:400});let j=`${process.env.NEXT_PUBLIC_BASE_URL||"http://localhost:3000"}/join/${h}`,k=`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You're Invited to ${c}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 30px;
        }
        .event-details {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            align-items: center;
            margin: 15px 0;
        }
        .detail-icon {
            width: 20px;
            height: 20px;
            margin-right: 12px;
            color: #667eea;
        }
        .detail-text {
            flex: 1;
        }
        .detail-label {
            font-size: 14px;
            color: #64748b;
            margin: 0;
        }
        .detail-value {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin: 2px 0 0 0;
        }
        .venue-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .venue-name {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 8px 0;
        }
        .venue-address {
            color: #64748b;
            margin: 0 0 12px 0;
        }
        .venue-rating {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .stars {
            color: #fbbf24;
        }
        .rating-text {
            color: #64748b;
            font-size: 14px;
        }
        .rsvp-section {
            text-align: center;
            margin: 30px 0;
        }
        .rsvp-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s;
        }
        .rsvp-button:hover {
            transform: translateY(-2px);
        }
        .footer {
            background: #f8fafc;
            padding: 20px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .header, .content {
                padding: 20px;
            }
            .rsvp-button {
                padding: 14px 28px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 You're Invited!</h1>
            <p>${i?`${i} has invited you to`:"Join us for"} ${c}</p>
        </div>
        
        <div class="content">
            <div class="event-details">
                <div class="detail-row">
                    <div class="detail-icon">📅</div>
                    <div class="detail-text">
                        <p class="detail-label">Date</p>
                        <p class="detail-value">${d}</p>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-icon">🕐</div>
                    <div class="detail-text">
                        <p class="detail-label">Time</p>
                        <p class="detail-value">${e}</p>
                    </div>
                </div>
                
                ${f?`
                <div class="detail-row">
                    <div class="detail-icon">📍</div>
                    <div class="detail-text">
                        <p class="detail-label">Location</p>
                        <p class="detail-value">${f}</p>
                    </div>
                </div>
                `:""}
            </div>
            
            ${g?`
            <div class="venue-card">
                <h3 class="venue-name">${g.name}</h3>
                <p class="venue-address">${g.address}</p>
                ${g.rating?`
                <div class="venue-rating">
                    <span class="stars">${"★".repeat(Math.floor(g.rating))}${"☆".repeat(5-Math.floor(g.rating))}</span>
                    <span class="rating-text">${g.rating}/5 stars</span>
                </div>
                `:""}
            </div>
            `:""}
            
            <div class="rsvp-section">
                <p style="margin-bottom: 20px; color: #64748b;">Ready to join? Click the button below to RSVP and get all the details!</p>
                <a href="${j}" class="rsvp-button">RSVP Now</a>
            </div>
        </div>
        
        <div class="footer">
            <p>This invitation was sent by <a href="${process.env.NEXT_PUBLIC_BASE_URL||"http://localhost:3000"}">PlanPal AI</a></p>
            <p>If you can't make it, no worries! Just ignore this email.</p>
        </div>
    </div>
</body>
</html>
    `,{data:l,error:m}=await P.emails.send({from:"PlanPal AI <invites@planpal.ai>",to:[b],subject:`🎉 You're invited to ${c}`,html:k});if(m)return console.error("Resend error:",m),O.NextResponse.json({error:"Failed to send email"},{status:500});return O.NextResponse.json({success:!0,messageId:l?.id,message:"Email sent successfully"},{status:200})}catch(a){return console.error("Email API error:",a),O.NextResponse.json({error:"Internal server error"},{status:500})}}let R=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/send-email/route",pathname:"/api/send-email",filename:"route",bundlePath:"app/api/send-email/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"/Users/maxbernstein/Desktop/ai-workspace/projects/Plan-Pal-Master/src/app/api/send-email/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:S,workUnitAsyncStorage:T,serverHooks:U}=R;function V(){return(0,g.patchFetch)({workAsyncStorage:S,workUnitAsyncStorage:T})}async function W(a,b,c){var d;let e="/api/send-email/route";"/index"===e&&(e="/");let g=await R.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,resolvedPathname:C}=g,D=(0,j.normalizeAppPath)(e),E=!!(y.dynamicRoutes[D]||y.routes[C]);if(E&&!x){let a=!!y.routes[C],b=y.dynamicRoutes[D];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let F=null;!E||R.isDev||x||(F="/index"===(F=C)?"/":F);let G=!0===R.isDev||!E,H=E&&!G,I=a.method||"GET",J=(0,i.getTracer)(),K=J.getActiveScopeSpan(),L={params:v,prerenderManifest:y,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:G,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:H,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>R.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},M=new k.NodeNextRequest(a),N=new k.NodeNextResponse(b),O=l.NextRequestAdapter.fromNodeNextRequest(M,(0,l.signalFromNodeResponse)(b));try{let d=async c=>R.handle(O,L).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=J.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${I} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${I} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&B&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=L.renderOpts.fetchMetrics;let i=L.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=L.renderOpts.collectedTags;if(!E)return await (0,o.I)(M,N,e,L.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,d=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await R.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:H,isOnDemandRevalidate:A})},z),b}},l=await R.handleResponse({req:a,nextConfig:w,cacheKey:F,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,responseGenerator:k,waitUntil:c.waitUntil});if(!E)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&E||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(M,N,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};K?await g(K):await J.withPropagatedContext(a.headers,()=>J.trace(m.BaseServerSpan.handleRequest,{spanName:`${I} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":I,"http.target":a.url}},g))}catch(b){if(K||b instanceof s.NoFallbackError||await R.onRequestError(a,b,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:H,isOnDemandRevalidate:A})}),E)throw b;return await (0,o.I)(M,N,new Response(null,{status:500})),null}}},96487:()=>{}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[586,692],()=>b(b.s=96384));module.exports=c})();