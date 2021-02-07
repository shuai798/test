import React, { Component } from 'react';
import PropTypes from 'prop-types';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode.react';

class DownloadQrcode extends Component {
    static propTypes = {
        // 设置value属性为string类型且必传
        value: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            qrId: '',
        };
    }

    componentDidMount = () => {
        this.setState({
            qrId: `imageQrcode${Math.random()
                .toString(16)
                .slice(2, 8)}`,
        });
    };

    dowloadQRcode = name => {
        const { qrId } = this.state;
        html2canvas(document.getElementById(qrId), {
            scale: 3,
            logging: true,
            windowHeight: document.body.scrollHeight,
            windowWidth: document.body.scrollWidth,
            useCORS: true,
            allowTaint: true,
            y: window.pageYOffset,
        }).then(canvas => {
            const { userAgent } = navigator;
            // ie
            if (userAgent.indexOf('Trident') !== -1) {
                const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                const arr = image.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n) {
                    n -= 1;
                    u8arr[n] = bstr.charCodeAt(n);
                }
                window.navigator.msSaveBlob(new Blob([u8arr], { type: mime }), `${name}.png`);
            } else {
                // not ie
                const saveUrl = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.href = saveUrl;
                a.download = name;
                a.click();
            }
        });
    };

    render() {
        const { qrId } = this.state;
        const { value, width = 100, height = 100, name, backgroundColor = '#fff', fgColor = '#000', bgColor = '#fff', imageSettings } = this.props;
        return (
            <div>
                <div id={qrId} style={{ position: 'absolute', top: 0, zIndex: -999, backgroundColor }}>
                    <QRCode imageSettings={imageSettings} fgColor={fgColor} bgColor={bgColor} className="p5" style={{ width, height }} value={value}></QRCode>
                    {name ? (
                        <div className="text-center" style={{ marginTop: -10 }}>
                            {name}
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}

export default DownloadQrcode;
