const axios = require('axios')
const fs = require('fs')
const {google} = require('googleapis')
const moment = require('moment')
const readline = require('readline')
require('dotenv').config()

const DIR_PATH = process.env.DIR_PATH
const DOWNLOAD_PATH = DIR_PATH+'download/'
const CLIENT_SECRET_PATH = DIR_PATH+'client_secret.json'
const TOKEN_PATH = DIR_PATH+'token.json'
const FILE_IDS_PATH = DIR_PATH+'file_ids.json'
const AREA_CODE = process.env.AREA_CODE
const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID
const FILE_NAMES = [
	process.env.FILE_NAME1,
	process.env.FILE_NAME2,
	process.env.FILE_NAME3,
	process.env.FILE_NAME4,
	process.env.FILE_NAME5,
	process.env.FILE_NAME6,
	process.env.FILE_NAME7,
	process.env.FILE_NAME8,
	process.env.FILE_NAME9,
	process.env.FILE_NAME10,
	process.env.FILE_NAME11,
	process.env.FILE_NAME12
]
const BASE_URL = 'https://www.jma.go.jp/jp/radnowc/imgs/nowcast/'+AREA_CODE+'/'
const RADAR_BASE_URL = 'https://www.jma.go.jp/jp/radnowc/imgs/radar/'+AREA_CODE+'/'
const SCOPES = ['https://www.googleapis.com/auth/drive']

function round(date, duration, method) {
	return moment(Math[method]((+date) / (+duration)) * (+duration))
}

function authorize(credentials, callback) {
	const {client_secret, client_id, redirect_uris} = credentials.installed
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
	fs.readFile(TOKEN_PATH, (err, token) => {
		if (err) return getAccessToken(oAuth2Client, callback)
		oAuth2Client.setCredentials(JSON.parse(token))
		callback(oAuth2Client)
	})
}

function getAccessToken(oAuth2Client, callback) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	})
	console.log('Authorize this app by visiting this url:', authUrl)
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})
	rl.question('Enter the code from that page here: ', (code) => {
		rl.close()
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return console.error('Error retrieving access token', err)
			oAuth2Client.setCredentials(token)
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err)
				console.log('Token stored to', TOKEN_PATH)
			})
			callback(oAuth2Client)
		})
	})
}
async function main() {
	var fileIds = {}
	if (fs.existsSync(FILE_IDS_PATH)) {
		var contents = fs.readFileSync(FILE_IDS_PATH)
		fileIds = JSON.parse(contents)
		console.log('Google Drive file ID list found')
	}
	
	console.log('Downloading images')
	const now = moment()
	var last = round(now, moment.duration(5, 'minutes'), 'floor')
	var lastStr = last.format('YMMDDHHmm')
	var response = null
	await axios({method: 'get', url: RADAR_BASE_URL+lastStr+'-00.png', responseType: 'stream'})
	.then(r => {
		response = r
	})
	.catch(async e => {
		last = last.subtract(5, 'minutes')
		lastStr = last.format('YMMDDHHmm')
		await axios({method: 'get', url: RADAR_BASE_URL+lastStr+'-00.png', responseType: 'stream'})
		.then(r => {
			response = r
		})
		.catch(async e => {
			last = last.subtract(5, 'minutes')
			lastStr = last.format('YMMDDHHmm')
			await axios({method: 'get', url: RADAR_BASE_URL+lastStr+'-00.png', responseType: 'stream'})
			.then(r => {
				response = r
			})
			.catch(e => {
				last = null
			})
		})
	})

	if (last == null) {
		console.log('Failed')
	} else {
		var files = [DOWNLOAD_PATH+'01.png']
		response.data.pipe(fs.createWriteStream(DOWNLOAD_PATH+'01.png'))
		last = last.subtract(5, 'minutes')
		lastStr = last.format('YMMDDHHmm')
		await axios({method: 'get', url: BASE_URL+lastStr+'-02.png', responseType: 'stream'}).then(r => {
			r.data.pipe(fs.createWriteStream(DOWNLOAD_PATH+'02.png'))
			files.push(DOWNLOAD_PATH+'02.png')
		})
		await axios({method: 'get', url: BASE_URL+lastStr+'-03.png', responseType: 'stream'}).then(r => {
			r.data.pipe(fs.createWriteStream(DOWNLOAD_PATH+'03.png'))
			files.push(DOWNLOAD_PATH+'03.png')
		})
		await axios({method: 'get', url: BASE_URL+lastStr+'-04.png', responseType: 'stream'}).then(r => {
			r.data.pipe(fs.createWriteStream(DOWNLOAD_PATH+'04.png'))
			files.push(DOWNLOAD_PATH+'04.png')
		})
		await axios({method: 'get', url: BASE_URL+lastStr+'-05.png', responseType: 'stream'}).then(r => {
			r.data.pipe(fs.createWriteStream(DOWNLOAD_PATH+'05.png'))
			files.push(DOWNLOAD_PATH+'05.png')
		})
		await axios({method: 'get', url: BASE_URL+lastStr+'-06.png', responseType: 'stream'}).then(r => {
			r.data.pipe(fs.createWriteStream(DOWNLOAD_PATH+'06.png'))
			files.push(DOWNLOAD_PATH+'06.png')
		})
		await axios({method: 'get', url: BASE_URL+lastStr+'-07.png', responseType: 'stream'}).then(r => {
			r.data.pipe(fs.createWriteStream(DOWNLOAD_PATH+'07.png'))
			files.push(DOWNLOAD_PATH+'07.png')
		})
		await axios({method: 'get', url: BASE_URL+lastStr+'-08.png', responseType: 'stream'}).then(r => {
			r.data.pipe(fs.createWriteStream(DOWNLOAD_PATH+'08.png'))
			files.push(DOWNLOAD_PATH+'08.png')
		})
		await axios({method: 'get', url: BASE_URL+lastStr+'-09.png', responseType: 'stream'}).then(r => {
			r.data.pipe(fs.createWriteStream(DOWNLOAD_PATH+'09.png'))
			files.push(DOWNLOAD_PATH+'09.png')
		})
		await axios({method: 'get', url: BASE_URL+lastStr+'-10.png', responseType: 'stream'}).then(r => {
			r.data.pipe(fs.createWriteStream(DOWNLOAD_PATH+'10.png'))
			files.push(DOWNLOAD_PATH+'10.png')
		})
		await axios({method: 'get', url: BASE_URL+lastStr+'-11.png', responseType: 'stream'}).then(r => {
			r.data.pipe(fs.createWriteStream(DOWNLOAD_PATH+'11.png'))
			files.push(DOWNLOAD_PATH+'11.png')
		})
		await axios({method: 'get', url: BASE_URL+lastStr+'-12.png', responseType: 'stream'}).then(r => {
			r.data.pipe(fs.createWriteStream(DOWNLOAD_PATH+'12.png'))
			files.push(DOWNLOAD_PATH+'12.png')
		})
		
		if (files.length == 12) {
			console.log('Downloaded images')
			fs.readFile(CLIENT_SECRET_PATH, (err, content) => {
				if (err) return console.log('Error loading client secret file:', err)
				authorize(JSON.parse(content), uploadFiles)
			})
			
			function uploadFiles(auth) {
				const drive = google.drive({version: 'v3', auth})
				if (Object.keys(fileIds).length == 0) { // create
					files.forEach(async (filePath, index) => {
						var fileMetadata = {
							name: FILE_NAMES[index],
							parents: [DRIVE_FOLDER_ID]
						}
						var media = {
							mimeType: 'image/png',
							body: fs.createReadStream(filePath)
						}
						await drive.files.create({
							resource: fileMetadata,
							media: media,
							fields: 'id'
						}, (err, file) => {
							if (err) {
							  console.error(err)
							} else {
							  console.log('Created:', FILE_NAMES[index], file.data.id)
							  fileIds[FILE_NAMES[index]] = file.data.id
							  if (Object.keys(fileIds).length == 12) {
								  fs.writeFileSync(FILE_IDS_PATH, JSON.stringify(fileIds))
							  }
							}
						})
					})
				} else { // update
					files.forEach((filePath, index) => {
						var fileMetadata = {
							name: FILE_NAMES[index]
						}
						var media = {
							mimeType: 'image/png',
							body: fs.createReadStream(filePath)
						}
						drive.files.update({
							fileId: fileIds[FILE_NAMES[index]],
							resource: fileMetadata,
							media: media
						}, (err, file) => {
							if (err) {
							  console.error(err)
							} else {
							  console.log('Updated:', FILE_NAMES[index], file.data.id)
							}
						})
					})
				}
			}
			
			
			
			
			
		}
	}
}

main()