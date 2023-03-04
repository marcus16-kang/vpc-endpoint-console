/// <reference types="aws-sdk" />

const loginForm = document.getElementById('login-form');
const loginSpinner = document.getElementById('login-spinner');
const loginAlert = document.getElementById('login-alert');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    spinner(event.submitter, loginSpinner, true);

    const formData = new FormData(loginForm);
    const accessKeyId = formData.get('access-key-id');
    const secretAccessKey = formData.get('secret-access-key');

    if (accessKeyId.length !== 20) {
        loginAlert.classList.remove('alert-info', 'alert-success');
        loginAlert.classList.add('alert-danger');
        loginAlert.innerText = 'Please type the correct Access Key ID.';
        document.getElementById('inputAccessKeyId').focus();
    } else if (secretAccessKey.length !== 40) {
        loginAlert.classList.remove('alert-info', 'alert-success');
        loginAlert.classList.add('alert-danger');
        loginAlert.innerText = 'Please type the correct Secret Access Key.';
        document.getElementById('inputSecretAccessKey').focus();
    } else {
        const credentials = new AWS.Credentials(
            formData.get('access-key-id'),
            formData.get('secret-access-key'),
        );

        const ec2 = new AWS.EC2({
            apiVersion: '2016-11-15',
            credentials: credentials,
            region: 'us-east-1',
        });

        ec2.describeRegions({}, (err, data) => {
            if (err && err.code === 'AuthFailure') {
                loginAlert.classList.remove('alert-info', 'alert-success');
                loginAlert.classList.add('alert-danger');
                loginAlert.innerText = 'Wrong credential information. Please check the keys.';
                document.getElementById('inputSecretAccessKey').focus();
            } else if (err) {
                console.log(err, err.stack);

                loginAlert.classList.remove('alert-info', 'alert-success');
                loginAlert.classList.add('alert-danger');
                loginAlert.innerText = 'ERROR! Please contact the developer.';
                document.getElementById('inputSecretAccessKey').focus();
            } else {
                loginAlert.classList.remove('alert-info', 'alert-success');
                loginAlert.classList.add('alert-success');
                loginAlert.innerText = 'Success to get region list.';

                setRegionSelect(data.Regions.map(({RegionName}) => (RegionName)));
            }
        });
    }

    spinner(event.submitter, loginSpinner, false);
});

const setRegionSelect = (regions) => {
    let regionOptions = '<option selected value="0">Select the region</option>'

    for (let region of regions) {
        regionOptions += '<option value="' + region + '">' + region + '</option>'
    }

    document.getElementById('inputRegion').innerHTML = regionOptions;
}

const spinner = (button, spinner, status) => {
    spinner.classList.remove('d-none');
    document.getElementById('login-spinner').classList.remove('d-none');
    if (status === true) {    // spinner true
        console.log('true');
        button.classList.add('disabled');
        spinner.classList.remove('d-none');
    } else {
        button.classList.remove('disabled');
        spinner.classList.add('d-none');
    }
}