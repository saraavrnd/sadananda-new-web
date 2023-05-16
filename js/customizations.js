var app_url_prefix = `/sadananda-new-web`
// var app_url_prefix = ''
var load_results = {
    'banner' : 0,
    'initiative' : 0,
    'about_us' : 0
}
loadBanners = function(page, cb) {
    console.log('Loading banner data for page:' + page)
    
    const url = `${app_url_prefix}/data/banner/${page}.dat`
    try {
        $.ajax({
            type: 'GET',
            url: url,
            success: (data)  => {
                // console.log("Banner data:", data);
                const lines = data.split('\n').filter((line) => {
                    return $.trim(line).length > 0 && (! $.trim(line).startsWith('#'))
                })
                // console.log('Lines', lines)
                var banners = []
                lines.forEach((line) => {
                    const tokens = line.split('sub-heading=')
                    if(tokens.length == 2) {
                        const parts = tokens[0].split(',')
                        const image = $.trim(parts[0].substr(parts[0].indexOf('image=')+6))
                        const heading = $.trim(parts[1].substr(parts[1].indexOf('heading=')+8))
                        
                        banners.push( {
                            image: image,
                            heading: heading,
                            sub_heading: tokens[1]
                        })
                    }
                })
                // console.log('Banners', banners)
                cb(undefined, banners)
            },
            error: (request, status, error) => {
                console.error('Failed to get the banner data')
                console.error('Request', request)
                console.error('Status', status)
                console.error('Error', error)
                cb(error, undefined)
            }
        });
    } catch(ex) {
        console.log('Exception occurred while loading the banners data', ex)
        cb(ex, undefined)
    }
}

renderBanner = function(id, bannerdata) {
    const bannertemplate = `<div class="slide-container" >
			<img src="<REPLACE_IMAGE>">
            <div class="banner-content">
            <h2 class="banner-title"><REPLACE_HEADING></h2>
            <p class="banner-details"><REPLACE_SUBHEADING></p>
        </div>

		</div>`
    var bannerHTML = []
    bannerdata.forEach((banner) => {
        var tmp = bannertemplate.replace("<REPLACE_IMAGE>", banner.image);
        tmp = tmp.replace("<REPLACE_SUBHEADING>", banner.sub_heading);
        tmp = tmp.replace("<REPLACE_HEADING>", banner.heading);
        bannerHTML.push(tmp)
    })
    $(id).html(bannerHTML.join(''))
}

loadInitiatives = function(cb) {
    const url = `${app_url_prefix}/data/initiatives/index.dat`;
    console.log('Loading initiatives from:', url)

    try {
        $.ajax({
            type: 'GET',
            url: url,
            success: (data)  => {
                // console.log("Banner data:", data);
                const lines = data.split('\n').filter((line) => {
                    return $.trim(line).length > 0 && (! $.trim(line).startsWith('#'))
                })
                // console.log('Lines', lines)
                var initiatives = []
                lines.forEach((line) => {
                    const tokens = line.split(',')
                    if(tokens.length == 4) {
                        
                        initiatives.push( {
                            id: tokens[0].split('=')[1],
                            image: tokens[1].split('=')[1],
                            name: tokens[2].split('=')[1],
                            link: tokens[3].split('=')[1],
                        })
                    }
                })
                console.log('Banners', initiatives)
                cb(undefined, initiatives)
            },
            error: (request, status, error) => {
                console.error('Failed to get the initiatives data')
                console.error('Request', request)
                console.error('Status', status)
                console.error('Error', error)
                cb(error, undefined)
            }
        });
    } catch(ex) {
        console.log('Exception occurred while loading the initiatives data', ex)
        cb(ex, undefined)
    }
}

renderInitiatives = function(id, menuid, initiatives) {
    const initiativetemplate = `<div class="initiative-slide-container" >
                                <div class="initiative-image">
                                    <a href="<REPLACE_LINK>">
                                        <img src="<REPLACE_IMAGE>" class="rounded">
                                    </a>
                                    <div class="slide-overlay">
                                        <div class="slide-overlay-inner">
                                            <a href="page-donate.html?name=<REPLACE_ID>" class="button button-white">Donate Now</a>
                                            <a href="<REPLACE_LINK>" class="button button-white">more...</a>
                                        </div>
                                    </div>
                                </div>
                                <a href="<REPLACE_LINK>">
                                    <h6 class="initiative-name">
                                        <REPLACE_NAME>
                                    </h6>
                                </a>
                            
                            </div>`
    var initiativeHTML = []
    initiatives.forEach((initiative) => {
        var tmp = initiativetemplate.replaceAll("<REPLACE_LINK>", initiative.link);
        tmp = tmp.replaceAll("<REPLACE_IMAGE>", initiative.image);
        tmp = tmp.replaceAll("<REPLACE_NAME>", initiative.name);
        tmp = tmp.replaceAll("<REPLACE_ID>", initiative.id);
        initiativeHTML.push(tmp)
    })
    $(id).html(initiativeHTML.join(''))

    const initiatives_menu_template = `<li>
                                            <a href="<REPLACE_LINK>">
                                                <REPLACE_NAME>
                                            </a>
                                        </li>`
    var initiativeMenuHTML = []
    initiatives.forEach((initiative) => {
        var tmp = initiatives_menu_template.replaceAll("<REPLACE_LINK>", initiative.link);
        tmp = tmp.replaceAll("<REPLACE_NAME>", initiative.name);
        initiativeMenuHTML.push(tmp)
    })
    $(menuid).html(initiativeMenuHTML.join(''));
}	

loadAboutUs = function(cb) {
    const url = `${app_url_prefix}/data/about_us.dat`;
    console.log('Loading about us from:', url)

    try {
        $.ajax({
            type: 'GET',
            url: url,
            success: (data)  => {
                // console.log("Banner data:", data);
                const lines = data.split('\n').filter((line) => {
                    return $.trim(line).length > 0 && (! $.trim(line).startsWith('#'))
                })
                // console.log('Lines', lines)
                var about_us = {}
                lines.forEach((line) => {
                    const index = line.indexOf('=')
                    if(index != -1) {
                        
                        const key = line.substring(0, index);
                        const value = line.substring(index+1)
                        about_us[key] = value
                    }
                })
                console.log('About', about_us)
                cb(undefined, about_us)
            },
            error: (request, status, error) => {
                console.error('Failed to get the about ius data')
                console.error('Request', request)
                console.error('Status', status)
                console.error('Error', error)
                cb(error, undefined)
            }
        });
    } catch(ex) {
        console.log('Exception occurred while loading the about us data', ex)
        cb(ex, undefined)
    }
}

renderAboutUsAndSocialContacts = function(about_us_data) {

    renderAboutUS('#anandam_mini_desc', 'ABOUT_ANANDAM_MIN_DESC', about_us_data)
    renderAboutUS('#sadananda_mini_desc', 'ABOUT_SADANANDA_MIN_DESC', about_us_data)

    renderAboutUS('#anandam_detailed_desc', 'ABOUT_ANANDAM_DETAILED_DESC', about_us_data)
    renderAboutUS('#sadananda_detailed_desc', 'ABOUT_SADANANDA_DETAILED_DESC', about_us_data)
    renderSocialContacts('#social_contacts_phone', 'CONTACT_PHONE', about_us_data)
    renderSocialContacts('#social_contacts_fb', 'CONTACT_FACEBOOK_ID', about_us_data)
    renderSocialContacts('#social_contacts_twitter', 'CONTACT_TWITTER_ID', about_us_data)
    renderSocialContacts('#social_contacts_email', 'CONTACT_EMAIL_ID', about_us_data)

    renderContactUS('#contact_address', 'CONTACT_ADDRESS', about_us_data)
    renderContactUS('#contact_phone', 'CONTACT_PHONE', about_us_data)
    renderContactUS('#contact_email', 'CONTACT_EMAIL_ID', about_us_data)

    renderLegalClaim('#legalDisclaimer .modal-body', 'LEGAL_DISCLAIMER', about_us_data)
}

showLegalDisclaimer = function( ) {
    // $('#legalDisclaimer').modal({
    //     show: true,
    //     focus: true
    // })
    $('#legalDisclaimer').modal('show')
    console.log('Show legal')
}

renderLegalClaim = function(id, key, about_us_data) {
    $(id).html(about_us_data[key])
}

renderContactUS = function(id, key, about_us_data) {
    $(id).html(about_us_data[key])
}

renderAboutUS = function(id, key, about_us_data) {
    $(id).html(about_us_data[key])
}

renderSocialContacts = function(id, key, about_us_data) {
    if(about_us_data[key] && about_us_data[key].length > 0) {
        $(id).attr("href", about_us_data[key])
    } else {
        $(id).hide();
    }
}

showLoading = function(status) {
    if(status) {
        $('#loading-status').show()
        $('.wrapper, .footer ').hide()
    } else {
        $('#loading-status').hide()
        $('.wrapper, .footer').show()
    }
}
loadstatus = function(step, result) {

    showLoading(true);
    load_results[step] = result;

    if(load_results['banner'] == 1 
        && load_results['initiative'] == 1 
        && load_results['about_us'] == 1 
    ) {
        showLoading(false);
    }

}