window.onload = () => {
    let themeType = getThemeTypeInCookie();

    if (themeType === undefined || themeType === 'undefined') {
        setThemeTypeInCookie('auto');
        themeType = windowTheme();
    }

    setTheme(themeType);
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (getThemeTypeInCookie() === 'auto') {
        setTheme('auto');
    }
});

document.querySelectorAll('.theme-selector').forEach((value, key, parent) => {
    value.addEventListener('click', (event) => {
        let themeType = event.target.getAttribute('data-theme-type');

        console.log(themeType);

        setTheme(themeType);
    });
});

const windowTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    } else {
        return 'light';
    }
}

const setTheme = (themeType) => {
    setThemeTypeInCookie(themeType);

    if (themeType === 'auto') {
        themeType = windowTheme();
    }

    document.querySelector('html').dataset.bsTheme = themeType;
}

const setThemeTypeInCookie = (themeType) => {
    document.cookie = 'themeType=' + themeType + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
}

const getThemeTypeInCookie = () => {
    let x, y;
    let val = document.cookie.split(';');
    for (let i = 0; i < val.length; i++) {
        x = val[i].substring(0, val[i].indexOf('='));
        y = val[i].substring(val[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, '');
        // 앞과 뒤의 공백 제거하기
        if (x === 'themeType') {
            return decodeURI(y);
        }
    }
}