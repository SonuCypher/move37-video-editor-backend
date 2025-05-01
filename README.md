
## Deployment

 install dependencies

```bash
  npm install -y
```
 setup your env variables

```bash
DB_HOST="host"
DB_USER="your db user"
DB_PASSWORD="your db password"
DB_NAME="your db name"
```
To deploy this project run

```bash
  npm run dev      or
  npm run start
```
server will be running locally on port 3000
and /api/videos is the base route

```bash
  localhost:3000/api/videos
```


## API Reference

### Upload

```http
  POST /upload
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `video` | `file type` | **Required**. your video file in form data|

### Trim video

```http
  POST /:id/trim
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `start`      | `number` | **Required**. start time (sec)  |
| `end`      | `number` | **Required**. end time (sec) |

| params | type     |Description                    |
| :--------| :----------    | :---------------------|
|`id`|`number`|**Required**. 




### Add subtitles

```http
  POST /:id/subtitles
```

| body | type     |Description                    |
| :--------| :----------    | :---------------------|
|`start`|`number`|**Required**|
|`end`   |`number`|**Required**|
|`text`  |`string`|**Required** 

| params | type     |Description                    |
| :--------| :----------    | :---------------------|
|`id`|`number`|**Required**. 





### Render video

```http
  POST /:id/render
```

| Params | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | **Required**.  |


### Download

```http
  GET /:id/download
```

| Params | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | **Required**.  |

