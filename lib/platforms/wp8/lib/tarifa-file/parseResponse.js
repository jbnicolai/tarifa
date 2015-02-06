module.exports = function (response, o) {
    if(response.certificate_path) {
        o.signing = o.signing || {};
        o.signing.wp8 = {
            company_app_distribution: {
                certificate_path: response.certificate_path
            }
        };
        o.configurations.wp8.stage.sign = 'company_app_distribution';
    }

    return o;
};
