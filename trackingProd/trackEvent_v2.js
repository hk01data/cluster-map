(function(d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0]
            if (d.getElementById(id)) {
                return
            }

            js = d.createElement(s)
            js.id = id
            js.src = 'https://cdn.hktester.com/sdk/hk01/v5.2.2/jssdk.js'
                // js.src = '/dist/iife/index.js?ts=' + Date.now()
            fjs.parentNode.insertBefore(js, fjs)
        })(document, 'script', 'hk01-jssdk')



window.hk01AsyncInit = function() {
    var appConfig = {
                appId: 'datanews',
                appVersion: '1.0',
                sessionId: '',
                service: 'datanews'
            }

    var trackerClientOptions = {
                GA: {
                    trackingId: 'UA-115624352-1'
                },
                Piwik: {
                    trackingUrl: 'https://track.hktester.com/v2/piwik.php',
                    siteId: 5
                },
                webviewBridgeEnabled: false
            };

    window.jssdk = new HK01(appConfig, trackerClientOptions)

            // If version is ^5.0.0 or later, init sdk with async init
        if (window.jssdk.init) {
            window.jssdk.init().then(function init(instance) {
                    return instance
                })
            }

            // track a pageview
            //try {
            //    if (window.jssdk) window.jssdk.trackerClient.pageView({
            //        GA: false,
            //        Piwik: true
            //    });
            //} catch (error) {}

            // track a pageview with custom href and path 
            
function fireMapPV(url){
            try {
                if (window.jssdk) window.jssdk.trackerClient.pageView({
                    GA: false,
                    Piwik: true
                    
                    }, {}, document.location.href, location.pathname + location.href);
            } 

                catch (error) {} 

            }

            function removehash(string) {
                return string.replace("#", "/");
            }
