import * as React from 'react';

import { loading } from 'src/component/loading';
import { constant } from 'src/constant';
import { history } from 'src';
import { i_responce } from 'src/interface/i_response';
const FileType = require('file-type');

// 2MB
const maxsize = 2000000;

const create = (
  file: FileList,
  set_display: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const reader = new FileReader();

  reader.onload = async function (event: any) {
    try {
      const _base64 = event.target.result;

      // 余計な文字列を取り除く
      const _file_data = _base64.replace(/^data:\w+\/\w+;base64,/, '');

      // デコード
      const _decode_file = Buffer.from(_file_data, 'base64');

      const _type = await FileType.fromBuffer(_decode_file);

      // 画像ファイルかチェック
      if (
        !(
          _type.mime === 'image/jpeg' ||
          _type.mime === 'image/png' ||
          _type.mime === 'image/gif'
        )
      ) {
        alert('画像ファイルが選択されていません');
        return;
      }

      // 2MB以上は保存しない
      if (_decode_file.length > maxsize) {
        alert('ファイルサイズは2MB以内です');
        return;
      }

      set_display(false);

      // apiたたく
      fetch(`${constant.URL[process.env.NODE_ENV]}/create`, {
        method: 'post',
        body: JSON.stringify({
          image: _decode_file,
        }),
        headers: {
          Authorization: 'Bearer abc',
          'Content-Type': 'application/json',
        },
      })
        .then(async (res) => {
          if (res.status != 200) {
            alert('アップロードに失敗しました');
            return;
          }

          const _ret: i_responce['create'] = await res.json();

          const _id = setInterval(function () {
            clearInterval(_id);
            history.push(`/image?q=${_ret.q}`);
          }, 50);
        })
        .catch((err) => {});
    } catch (e) {
      return;
    }
  };

  if (file[0] === undefined) {
    alert('ファイルが選択されていません');
  } else {
    reader.readAsDataURL(file[0]);
  }
};

export const root = () => {
  const [display, set_display] = React.useState(true);

  /**
   * componentDidMount
   */
  React.useEffect(() => {
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

        <header>
          <img src="/img/header.png" />
        </header>
        <br />

        <main id="input_area">
          <br />
          <br />

          <div className="text-center">
            <input
              type="file"
              id="file_upload"
              accept="image/*"
              onChange={(e) => create(e.target.files, set_display)}
            />
          </div>
        </main>
      </div>
    </>
  );
};
