const getAwsEc2Client = (region) => {
    const credentials = new AWS.Credentials(
        document.getElementById('inputAccessKeyId').value,
        document.getElementById('inputSecretAccessKey').value,
    );

    return new AWS.EC2({
        apiVersion: '2016-11-15',
        credentials: credentials,
        region: region,
    });
}

const getRegion = () => {
    return document.getElementById('inputRegion').value;
}

const regionSelect = document.getElementById('inputRegion');
const vpcSelect = document.getElementById('inputVpc');

regionSelect.addEventListener('change', (event) => {
    getAwsEc2Client(event.target.value).describeVpcs({}, (err, data) => {
        if (err) {
            console.log(err, err.stack);
            alert('It has a problem. Please contact the developer.');
        } else {
            setVpcSelect(data.Vpcs);
        }
    });
});

vpcSelect.addEventListener('change', (event) => {
    getAwsEc2Client(getRegion()).describeSubnets({
        Filters: [{Name: 'vpc-id', Values: [event.target.value]}],
    }, (err, data) => {
        if (err) {
            console.log(err, err.stack);
            alert('It has a problem. Please contact the developer.');
        } else {
            const groups = data.Subnets.reduce((groups, item) => ({
                ...groups,
                    [item.AvailabilityZone]: [...(groups[item.AvailabilityZone] || []), item]
            }), {});
            console.log(groups);

            setSubnetSelect(groups);
        }
    });
});

const setVpcSelect = (vpcs) => {
    let vpcOptions = '<option selected value="0">Select the VPC</option>'

    for (let vpc of vpcs) {
        let vpcName = vpc.Tags.filter(obj => {
            return obj.Key === 'Name'
        });
        if (vpcName.length > 0) {
            vpcName = ', ' + vpcName[0].Value;
        }

        vpcOptions += '<option value="' + vpc.VpcId + '">' + vpc.VpcId + ' (' + vpc.CidrBlock + vpcName + ')</option>';
    }

    document.getElementById('inputVpc').innerHTML = vpcOptions;
}

const setSubnetSelect = (subnetsByAz) => {
    const subnetForm = document.getElementById('subnet-form');

    // reset subnet form
    subnetForm.innerHTML = '';

    // create subnet form by az
    for (const az of Object.keys(subnetsByAz).sort()) {
        let subnetOptions = '<option value="0">Select the Subnet</option>';

        for (const subnet of subnetsByAz[az]) {
            console.log(subnet);
            subnetOptions += '<option value="' + subnet.SubnetId + '">' + subnet.SubnetId + '</option>'
        }

        const subnetAzRow = '<div class="row">' +
            '<div class="col-3 form-check m-2">' +
            '<input class="form-check-input check-az" type="checkbox" id="inputCheckAz_' + az + '">' +
            '<label class="form-check-label user-select-none" for="inputCheckAz_' + az + '">' + az + '</label>' +
            '</div>' +
            '<div class="col-8 mt-1">' +
            '<select class="form-select select-subnet" disabled>' +
            subnetOptions +
            '</select>' +
            '</div>' +
            '</div>';

        subnetForm.innerHTML += subnetAzRow;
    }

    document.querySelectorAll('.check-az').forEach((value) => {
        value.addEventListener('change', (event) => {
            console.log(event);
            if(event.target.checked) {
                console.log(event.target.parentElement);
            } else {

            }
        });
    });
}