#!/usr/bin/env -S deno run --allow-net=chat.googleapis.com --allow-run=afplay

const WEBHOOK_URL =
  "YOUR_GOOGLE_CHAT_SPACE_WEBHOOK_URL";
const SOUND_FILE = "/System/Library/Sounds/Glass.aiff";
// const SOUND_FILE = "/System/Library/Sounds/Blow.aiff";
// const SOUND_FILE = "/System/Library/Sounds/Ping.aiff";

/**
 * コマンドライン引数または標準入力からメッセージを取得します。
 */
async function getInputText(): Promise<string> {
  if (Deno.args.length > 0) {
    return Deno.args.join("\n");
  }

  const chunks = [];
  for await (const chunk of Deno.stdin.readable) {
    chunks.push(chunk);
  }
  const buffer = new Uint8Array(
    chunks.reduce((acc, chunk) => acc + chunk.length, 0),
  );
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(buffer);
}

/**
 * Google Chatにメッセージを送信します。
 * @param text 送信するメッセージ
 */
async function sendGoogleChatMessage(text: string): Promise<void> {
  const payload = { text };
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Google Chatへの通知に失敗しました。ステータス: ${response.status} ${response.statusText}, レスポンス: ${errorBody}`,
    );
  }
}

/**
 * サウンドファイルを再生します。
 */
async function playSound(): Promise<void> {
  try {
    const command = new Deno.Command("afplay", {
      args: [SOUND_FILE],
    });
    const { code, stderr } = await command.output();
    if (code !== 0) {
      console.error(
        "サウンドの再生に失敗しました:",
        new TextDecoder().decode(stderr),
      );
    }
  } catch (error) {
    console.error("afplayコマンドの実行に失敗しました:", error);
  }
}

/**
 * メイン処理
 */
async function main() {
  try {
    const inputText = await getInputText();
    if (inputText.trim() === "") {
      console.error("入力が空です。メッセージを指定してください。");
      Deno.exit(1);
    }

    await sendGoogleChatMessage(inputText);
    console.log("メッセージが正常にGoogle Chatに送信されました。");

    await playSound();
  } catch (error) {
    console.error("エラーが発生しました:", error.message);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
