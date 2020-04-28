# googledrive-jma-radnowc

気象庁の降水ナウキャストの指定した地方の画像を Google ドライブにアップロードするためのライブラリです。

[気象庁 レーダー・ナウキャスト(降水・雷・竜巻)](https://www.jma.go.jp/jp/radnowc/)

 （2020年4月28日 更新）

## 動作環境
- node (v12.16.1, v14.0.0 で確認)
- npm (v6.13.4, v6.14.4 で確認)

## 使い方

### 1. Google Cloud Platform の準備

Google Cloud Platform で Google Drive API を有効にし、「API とサービス」で認証情報（OAuth クライアント ID）を作成します。

サーバなどで動かす場合はアプリケーションの種類に「その他」を選びます。

作成した認証情報をJSONファイルとしてダウンロードし、`client_secret.json`というファイル名でプロジェクトのディレクトリに置きます。

### 2. 環境変数ファイルの設定

`.env-sample`をコピーして`.env`ファイルを作成し、設定項目を入れます。

以下の3つを設定する必要があります。

- `DIR_PATH`: プロジェクトディレクトリの絶対パス（最後にスラッシュ入れる）
- `AREA_CODE`: 数字3桁の地方コード（下の対応表を参照）
- `DRIVE_FOLDER_ID`: 画像保存先の Google ドライブのフォルダID（ブラウザでフォルダの中身を見たときに URL に書いてあります）

### 3. node パッケージのインストール

`npm install`で必要なパッケージがインストールされます。

インストールに失敗する場合は node や npm のバージョンを確認済のものに合わせてみてください。

### 4. 実行

`node index.js`で降水ナウキャストの画像を Google ドライブにアップロードします。

初回は下記のような認証のメッセージが現れるので、指示通りに Web ページを開いてコードをコピーし貼り付けます。


    Authorize this app by visiting this url: https://accounts.google.com/o/oauth2/v2/auth?......
    Enter the code from that page here:

2回目以降の実行では、プロジェクトディレクトリに保存された`token.json`によって上記の認証をスキップできます。

また、初回の実行によって`file_ids.json`も生成されるので、2回目以降は初回に生成された Google ドライブのファイルを置き換えるようになります。

## 定期実行

10分ごとに cron で実行する場合はこんな感じになります。


    8,18,28,38,48,58 * * * * export NODE_PATH=<プロジェクトの絶対パス> && cd <プロジェクトの絶対パス> && node index.js

場合によっては node も絶対パスが必要かもしれません。


## 地方コード対応表

| コード | 地方 |
:---:|---- 
|000 | 全国 |
|201 | 北海道地方(北西部) |
|202 | 北海道地方(東部) |
|203 | 北海道地方(南西部) |
|204 | 東北地方(北部) |
|205 | 東北地方(南部) |
|206 | 関東地方 |
|207 | 甲信地方 |
|208 | 北陸地方(東部) |
|209 | 北陸地方(西部) |
|210 | 東海地方 |
|211 | 近畿地方 |
|212 | 中国地方 |
|213 | 四国地方 |
|214 | 九州地方(北部) |
|215 | 九州地方(南部) |
|216 | 奄美地方 |
|217 | 沖縄本島地方 |
|218 | 大東島地方 |
|219 | 宮古・八重山地方 |
