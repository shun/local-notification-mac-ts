# google-chat-notification-mac-ts

[![deno land](https://img.shields.io/badge/deno-^2.3.5-brightgreen?logo=deno)](https://deno.land)

Google Chatにメッセージを送信し、macOSのサウンドで完了通知を受け取るためのDenoスクリプトです。

## 概要

このスクリプトは、ターミナルからGoogle Chatへ手軽にメッセージを送信する機能を提供します。メッセージ送信が完了すると、macOSのシステムサウンドが再生され、処理の完了を知らせます。

## 主な機能

-   Google Chatへのメッセージ送信
-   macOSでの完了通知（サウンド再生）

## 前提条件

-   macOS
-   [Deno](https://deno.land) がインストールされていること

## セットアップ

`setup.sh` を実行すると、スクリプトが `google-chat-notification` というコマンド名で `~/.local/bin` にインストールされ、ターミナルから直接実行できるようになります。

```bash
./setup.sh
```

**注意:** `~/.local/bin` にパスが通っていない場合は、お使いのシェルの設定ファイル（`.zshrc`や`.bash_profile`など）に以下を追記してください。

```bash
export PATH="$HOME/.local/bin:$PATH"
```

## 使用方法

### 1. Google Chat Webhook URLの設定

このスクリプトを使用するには、まず環境変数 `GOOGLE_CHAT_WEBHOOK_URL` に、通知を送信したいGoogle ChatスペースのWebhook URLを設定する必要があります。

```bash
export GOOGLE_CHAT_WEBHOOK_URL="YOUR_GOOGLE_CHAT_SPACE_WEBHOOK_URL"
```

**補足:** もしこの環境変数が設定されていない場合、メッセージはどこにも送信されず、ローカルでのサウンド再生のみが行われます。

### 2. 通知の送信

ターミナルから以下のコマンドを実行します。

```bash
google-chat-notification <メッセージ>
```

成功すると、指定したメッセージがGoogle Chatに投稿され、macOSで完了サウンドが再生されます。

#### 例

```bash
google-chat-notification "デプロイが完了しました。"
```

改行を含むメッセージも送信できます。

```bash
google-chat-notification "バッチ処理完了
- 処理件数: 1,234件
- 実行時間: 5分30秒"
```

### インストールせずに直接実行する場合

リポジトリをクローンした後、以下のコマンドでもスクリプトを直接実行できます。

```bash
deno run --allow-env --allow-net google-chat-notification.ts <メッセージ>
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
