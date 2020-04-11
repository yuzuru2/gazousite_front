import * as React from 'react';
import { Link } from 'react-router-dom';

const QRCode = require('qrcode');
const copy = require('copy-to-clipboard');

import { loading } from 'src/component/loading';
import { constant } from 'src/constant';
import { history } from 'src';
import { i_responce } from 'src/interface/i_response';

export const image = () => {
  const [display, set_display] = React.useState(false);

  const [qr, set_qr] = React.useState('');
  const [image_url, set_image_url] = React.useState('');

  /**
   * componentDidMount
   */
  React.useEffect(() => {
    fetch(
      `${constant.URL[process.env.NODE_ENV]}/search?${location.search.substring(
        1,
        location.search.length
      )}`,
      {
        method: 'get',
        headers: {
          Authorization: constant.AUTHORIZATION_KEY,
          'Content-Type': 'application/json',
        },
      }
    )
      .then(async (res) => {
        if (res.status !== 200) {
          history.push('/');
          return;
        }

        const _ret: i_responce['search'] = await res.json();

        QRCode.toDataURL(location.href, (err, url) => {
          set_display(true);
          set_qr(url);
          set_image_url(
            `https://firebasestorage.googleapis.com/v0/b/${constant.GOOGLE_STORAGE_BUCKET}/o/${_ret.q}?alt=media`
          );
        });
      })
      .catch((e) => history.push('/'));
    return () => {};
  }, []);

  /**
   * componentWillUnmount
   */
  React.useEffect(() => {
    return () => {};
  }, []);

  if (!display) {
    return <>{loading()}</>;
  }

  return (
    <>
      <div id="wrap">
        <br />

        <main id="input_area">
          <nav aria-label="パンくずリスト">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">ホーム</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                画像
              </li>
            </ol>
          </nav>

          <div className="form-group" style={{ textAlign: 'center' }}>
            <div style={{ margin: 'auto' }}>
              <img
                src={image_url}
                style={{ width: '100%', border: 'solid 1px gray' }}
              ></img>
            </div>
          </div>

          <div id="button_area" style={{ textAlign: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                copy(location.href);
                alert('URLをコピーしました');
              }}
            >
              URLコピー
            </button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>

          <br />
          <br />

          <div className="form-group" style={{ textAlign: 'center' }}>
            <label>URLのQRコード</label>
            <div style={{ margin: 'auto' }}>
              <img
                src={qr}
                style={{ width: 150, height: 150, border: 'solid 1px gray' }}
              ></img>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
