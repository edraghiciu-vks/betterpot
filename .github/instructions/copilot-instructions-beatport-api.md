# Beatport API (OpenAPI 3.0.3)
_version: `v4` · license: Copyright Beatport · contact: <engineering@beatport.com> · [Terms of Service](https://support.beatport.com/hc/en-us/articles/4414997837716-Terms-and-Conditions#api)_

Beatport API documentation

> Generated from the provided OpenAPI JSON. Build time (UTC): 2025-09-20 13:59:24Z

## Authentication
This API defines the following security schemes:
- **basicAuth** — type: `http`, scheme: `basic`
- **cookieAuth** — type: `apiKey`, in: `cookie`
- **oauth2** — type: `oauth2`


## Endpoints (by tag)
- [auxiliary](#auxiliary)
- [catalog](#catalog)
- [curation](#curation)
- [db-health-check](#db-health-check)
- [health-check](#health-check)
- [my](#my)

## auxiliary
### GET /v4/auxiliary/artist-types/
**operationId:** `auxiliary_artist_types_list`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedArtistTypeListList` |  |

### GET /v4/auxiliary/artist-types/facets/
**operationId:** `auxiliary_artist_types_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `ArtistType` |  |

### GET /v4/auxiliary/artist-types/{id}/
**operationId:** `auxiliary_artist_types_retrieve`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `ArtistTypeDetail` |  |

### GET /v4/auxiliary/commercial-model-types/
**operationId:** `auxiliary_commercial_model_types_list`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedCommercialModelTypeListList` |  |

### GET /v4/auxiliary/commercial-model-types/facets/
**operationId:** `auxiliary_commercial_model_types_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `CommercialModelType` |  |


## catalog
### GET /v4/catalog/artists/
**operationId:** `catalog_artists_list`
A Mixin for adding the ability in a view top items by resource.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `created` | `query` | no | `string` (format: `date-time`) nullable | Filter by exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `enabled` | `query` | no | `boolean` enum: `false`, `true` | Filter by enabled.<br/><br/>* `false` - False<br/>* `true` - True |
| `id` | `query` | no | `array` items: `integer` | Filter by artist id exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `name` | `query` | no | `string` | Filter name by case-insensitive text containment. |
| `name_exact` | `query` | no | `string` | Filter by name exact match. |
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |
| `updated` | `query` | no | `string` (format: `date-time`) nullable | Filter by exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedArtistListList` |  |

### GET /v4/catalog/artists/facets/
**operationId:** `catalog_artists_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Artist` |  |

### GET /v4/catalog/artists/{id}/
**operationId:** `catalog_artists_retrieve`
A Mixin for adding the ability in a view top items by resource.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `ArtistDetail` |  |

### GET /v4/catalog/artists/{id}/images/
**operationId:** `catalog_artists_images_retrieve`
Return/create this artist's images.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Artist` |  |

### GET /v4/catalog/artists/{id}/top/{num}/
**operationId:** `catalog_artists_top_retrieve`
Return top &lt;N&gt; tracks for a artist by most popular rank, where N limited between 1 and 100.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |
| `num` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Artist` |  |

### GET /v4/catalog/artists/{id}/tracks/
**operationId:** `catalog_artists_tracks_retrieve`
Return this artist's tracks

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Artist` |  |

### GET /v4/catalog/charts/
**operationId:** `catalog_charts_list`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `add_date` | `query` | no | `string` (format: `date-time`) nullable | Filter by date added.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `curated_playlist_genre_id` | `query` | no | `array` items: `integer` | Filter on genre ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `dj_id` | `query` | no | `array` items: `integer` | Filter by the exact dj profile id.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `dj_name` | `query` | no | `array` items: `string` | Filter by case-insensitive DJ name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `dj_slug` | `query` | no | `array` items: `string` | Filter by case-insensitive DJ slug containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `enabled` | `query` | no | `boolean` enum: `false`, `true` | Filter by enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `genre_id` | `query` | no | `array` items: `number` | Filter on genre ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `genre_name` | `query` | no | `array` items: `string` | Filter on case-insensitive genre exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `id` | `query` | no | `array` items: `integer` | Filter by exact chart ID.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `is_approved` | `query` | no | `boolean` enum: `false`, `true` | Filter by approved boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_curated_playlist` | `query` | no | `integer` | Filter by is curated playlist boolean match. |
| `is_indexed` | `query` | no | `boolean` enum: `false`, `true` | Filter by indexed boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_published` | `query` | no | `boolean` enum: `false`, `true` | Filter by published boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `name` | `query` | no | `array` items: `string` | Filter by case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |
| `publish_date` | `query` | no | `string` (format: `date-time`) nullable | Filter by date published.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `register_ip_address` | `query` | no | `integer` (format: `int64`) min: -9223372036854775808, max: 9223372036854775807 | Filter by exact registration IP address match. |
| `sub_genre_id` | `query` | no | `array` items: `number` | Filter on sub genre ID.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `sub_genre_name` | `query` | no | `array` items: `string` | Filter on case-insensitive sub_genre name<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `track_id` | `query` | no | `array` items: `number` | Filter on track_id.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `updated` | `query` | no | `string` (format: `date-time`) | Filter by date added.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `user_id` | `query` | no | `array` items: `integer` | Filter by exact user ID.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `username` | `query` | no | `array` items: `string` | Filter by case-insensitive username containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedChartListList` |  |

### GET /v4/catalog/charts/facets/
**operationId:** `catalog_charts_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Chart` |  |

### GET /v4/catalog/charts/genre-overview/
**operationId:** `catalog_charts_genre_overview_retrieve`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `ChartGenreOverview` |  |

### GET /v4/catalog/charts/{id}/
**operationId:** `catalog_charts_retrieve`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `ChartDetail` |  |

### GET /v4/catalog/charts/{id}/images/
**operationId:** `catalog_charts_images_retrieve`
Return/create this chart's images.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Chart` |  |

### GET /v4/catalog/charts/{id}/tracks/
**operationId:** `catalog_charts_tracks_retrieve`
Return this chart's tracks, updating if necessary.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Chart` |  |

### GET /v4/catalog/charts/{id}/tracks/ids/
**operationId:** `catalog_charts_tracks_ids_retrieve`
Return this chart's track IDs.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Chart` |  |

### GET /v4/catalog/genres/
**operationId:** `catalog_genres_list`
A Mixin for adding the ability in a view top items by resource.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `enabled` | `query` | no | `boolean` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `name` | `query` | no | `string` nullable | Filter by exact genre name match. |
| `order_by` | `query` | no | `array` items: `string` enum: `-id`, `-status`, `id`, `status` | Ordering<br/><br/>* `id` - Genre ID<br/>* `-id` - Genre ID (descending)<br/>* `status` - Genre Status<br/>* `-status` - Genre Status (descending) |
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedGenreListList` |  |

### GET /v4/catalog/genres/facets/
**operationId:** `catalog_genres_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Genre` |  |

### GET /v4/catalog/genres/{id}/
**operationId:** `catalog_genres_retrieve`
A Mixin for adding the ability in a view top items by resource.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `GenreDetail` |  |

### GET /v4/catalog/genres/{id}/sub-genres/
**operationId:** `catalog_genres_sub_genres_retrieve`
Return this genre's sub-genres

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Genre` |  |

### GET /v4/catalog/genres/{id}/top/{num}/
**operationId:** `catalog_genres_top_retrieve`
Return top &lt;N&gt; tracks for a genre by most popular rank, where N limited between 1 and 100.

Takes optional argument `type=release` for `releases`.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |
| `num` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Genre` |  |

### GET /v4/catalog/genres/{id}/tracks/
**operationId:** `catalog_genres_tracks_retrieve`
Return this genre's tracks

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Genre` |  |

### GET /v4/catalog/labels/
**operationId:** `catalog_labels_list`
A Mixin for adding the ability in a view top items by resource.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `created` | `query` | no | `string` (format: `date-time`) | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `default_pre_order_weeks` | `query` | no | `array` items: `integer` | Filter by Default Pre-Order Weeks exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `enabled` | `query` | no | `boolean` enum: `false`, `true` | Filter by enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `hype_active` | `query` | no | `string` enum: `false`, `true` | Filter on active enrollment in Hype.<br/><br/>* `true` - True<br/>* `false` - False |
| `hype_eligible` | `query` | no | `string` enum: `false`, `true` | Filter on Hype eligibility.<br/><br/>* `true` - True<br/>* `false` - False |
| `hype_trial_end_date` | `query` | no | `string` (format: `date`) nullable | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `hype_trial_start_date` | `query` | no | `string` (format: `date`) nullable | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `id` | `query` | no | `array` items: `integer` | Filter by ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `is_available_for_hype` | `query` | no | `boolean` enum: `false`, `true` | Filter by Is Available for Hype exact match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_available_for_pre_order` | `query` | no | `boolean` enum: `false`, `true` | Filter by Is Available for Pre-Order exact match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_available_for_streaming` | `query` | no | `boolean` enum: `false`, `true` | Filter by Is Available for Streaming exact match.<br/><br/>* `false` - False<br/>* `true` - True |
| `label_manager` | `query` | no | `string` | Filter by case-insensitive Label Manager name containment. |
| `name` | `query` | no | `array` items: `string` | Filter by case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `name_exact` | `query` | no | `string` | Filter by exact label name. |
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |
| `supplier_id` | `query` | no | `array` items: `integer` | Filter by exact supplier ID.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `supplier_name` | `query` | no | `array` items: `string` | Filter by case-insensitive supplier name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `updated` | `query` | no | `string` (format: `date-time`) nullable | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedLabelListList` |  |

### GET /v4/catalog/labels/facets/
**operationId:** `catalog_labels_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Label` |  |

### GET /v4/catalog/labels/{id}/
**operationId:** `catalog_labels_retrieve`
A Mixin for adding the ability in a view top items by resource.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `LabelDetail` |  |

### GET /v4/catalog/labels/{id}/download/
**operationId:** `catalog_labels_download_retrieve`
A Mixin for adding the ability in a view top items by resource.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `LabelCSVExport` |  |

### GET /v4/catalog/labels/{id}/images/
**operationId:** `catalog_labels_images_retrieve`
Return/create this label's images.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Label` |  |

### GET /v4/catalog/labels/{id}/releases/
**operationId:** `catalog_labels_releases_retrieve`
Return this label's releases

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Label` |  |

### GET /v4/catalog/labels/{id}/top/{num}/
**operationId:** `catalog_labels_top_retrieve`
Return top &lt;N&gt; tracks for a label by most popular rank, where N limited between 1 and 100.

Takes optional argument `type=release` for `releases`.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |
| `num` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Label` |  |

### GET /v4/catalog/playlists/
**operationId:** `catalog_playlists_list`
Return list of Playlists.

For LINK users it checks that playlists are public and published
and will further filter according to subscription plan
For CMS users it will return all  playlists and use the catalog fields
Note that this is virtually identitical to the MyPlaylistsViewSet list method,
except the queryset does not filter by the requesting user id.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `artist_name` | `query` | no | `array` items: `string` | Filter on the artist name<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `created_date` | `query` | no | `string` (format: `date-time`) nullable | Filter on date range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `genre_id` | `query` | no | `array` items: `integer` | Filter on Genre ID<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `genre_name` | `query` | no | `array` items: `string` | Filter on Genre name<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `id` | `query` | no | `array` items: `integer` | Filter by exact ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `is_public` | `query` | no | `boolean` enum: `false`, `true` | * `false` - False<br/>* `true` - True |
| `name` | `query` | no | `array` items: `string` | Filter on Playlist name<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `order_by` | `query` | no | `array` items: `string` enum: `-create_date`, `-name`, `-update_date`, `create_date`, `name`, `update_date` | Order by a field. Choices: created_date, name, updated_date.             Use -created_datefor descending order<br/><br/>* `create_date` - Create date<br/>* `-create_date` - Create date (descending)<br/>* `update_date` - Update date<br/>* `-update_date` - Update date (descending)<br/>* `name` - Name<br/>* `-name` - Name (descending) |
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |
| `playlist_status` | `query` | no | `boolean` enum: `false`, `true` | * `false` - False<br/>* `true` - True |
| `playlist_type` | `query` | no | `array` items: `string` | Filter on Playlist name<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `playlist_type_id` | `query` | no | `array` items: `string` | Filter on Playlist ID<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `status` | `query` | no | `boolean` enum: `false`, `true` | * `false` - False<br/>* `true` - True |
| `updated_date` | `query` | no | `string` (format: `date-time`) nullable | Filter on date range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `user_id` | `query` | no | `array` items: `integer` | Filter by exact user ID.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `username` | `query` | no | `array` items: `string` | Filter by case-insensitive username containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedPlaylistProxyList` |  |

### GET /v4/catalog/playlists/facets/
**operationId:** `catalog_playlists_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Playlist` |  |

### GET /v4/catalog/playlists/{id}/
**operationId:** `catalog_playlists_retrieve`
Return a Playlist.
CMS users
Loads any playlist regardless of ownership and will use the catalog fields
LINK users
Restrict a private playlist that is not owned by requesting user.

Note that this is virtually identitical to the MyPlaylistsViewSet list method,
except the queryset does not filter by the requesting user id.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Playlist_metadata_response` | 200 |

### GET /v4/catalog/playlists/{id}/chart-mapping/
**operationId:** `catalog_playlists_chart_mapping_retrieve`
Get the chart mapping value if any

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Playlist` |  |

### GET /v4/catalog/playlists/{id}/partners/
**operationId:** `catalog_playlists_partners_retrieve`
Get the playlist Link! partners if any

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Playlist` |  |

### GET /v4/catalog/playlists/{playlists_pk}/tracks/
**operationId:** `catalog_playlists_tracks_list`
Return a list of `PlaylistTrack` objects for the given playlist.

The `PlaylistTrack` has a computed value "tombstoned" which indicates if the track was
added to a LINK playlist but is no longer available for LINK. The track remains in the
playlist but isn't streamable.

Note that this is virtually identitical to the MyPlaylistTracksViewSet list method,
except the queryset does not filter by the requesting user id.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `artist_id` | `query` | no | `array` items: `number` | Filter on artist ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `artist_name` | `query` | no | `array` items: `string` | Filter on case-insensitive artist name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `available_worldwide` | `query` | no | `string` enum: `false`, `true` | Filter on available worldwide boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `bpm` | `query` | no | `string` | Filter on exact, less/greater than equal and range. |
| `catalog_number` | `query` | no | `array` items: `string` | Filter on case-insensitive catalog_number exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `change_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `chord_type_id` | `query` | no | `array` items: `number` | Filter on exact key ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `current_status` | `query` | no | `array` items: `number` | Filter on current_status ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `enabled` | `query` | no | `string` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `encode_status` | `query` | no | `array` items: `string` | Filter on case-insensitive encode status exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `encoded_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `exclusive_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `exclusive_period` | `query` | no | `array` items: `number` | Filter on case-insensitive exclusive period exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `free_download_end_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `free_download_start_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `genre_enabled` | `query` | no | `string` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `genre_id` | `query` | no | `array` items: `number` | Filter on genre ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `genre_name` | `query` | no | `array` items: `string` | Filter on case-insensitive genre exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `guid` | `query` | no | `array` items: `string` | filter on exact guid match<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `id` | `query` | no | `array` items: `integer` | Filter on ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `is_available_for_streaming` | `query` | no | `string` enum: `false`, `true` | Filter on streaming available boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_classic` | `query` | no | `string` enum: `false`, `true` | Filter on is_classic boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_explicit` | `query` | no | `string` enum: `false`, `true` | Filter on is_explicit boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_hype` | `query` | no | `string` enum: `false`, `true` | Filter on is_hype boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `isrc` | `query` | no | `array` items: `string` | Filter on exact ISRC match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `key_id` | `query` | no | `array` items: `number` | Filter on exact key ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `key_name` | `query` | no | `array` items: `string` | <br/>            Filter key. Denote sharp as #, flat as b with minor/major separated by a space.<br/>            Available Keys:<br/>                "A Minor"<br/>                "A Major"<br/>                "Ab Minor"<br/>                "Ab Major"<br/>                "A# Minor"<br/>                "A# Major"<br/>                "B Minor"<br/>                "B Major"<br/>                "Bb Minor"<br/>                "Bb Major"<br/>                "C Minor"<br/>                "C Major"<br/>                "C# Minor"<br/>                "C# Major"<br/>                "D Minor"<br/>                "D Major"<br/>                "Db Minor"<br/>                "Db Major"<br/>                "D# Minor"<br/>                "D# Major"<br/>                "E Minor"<br/>                "E Major"<br/>                "Eb Minor"<br/>                "Eb Major"<br/>                "F Minor"<br/>                "F Major"<br/>                "F# Minor"<br/>                "F# Major"<br/>                "G Minor"<br/>                "G Major"<br/>                "Gb Minor"<br/>                "Gb Major"<br/>                "G# Minor"<br/>                "G# Major"<br/>            <br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_enabled` | `query` | no | `string` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `label_id` | `query` | no | `array` items: `number` | Filter on label ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_manager` | `query` | no | `string` | Filter by case-insensitive Label Manager name containment. |
| `label_name` | `query` | no | `array` items: `string` | Filter on case-insensitive label name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_name_exact` | `query` | no | `array` items: `string` | Filter on case-insensitive label name exact.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `mix_name` | `query` | no | `array` items: `string` | Filter on case-insensitive remix name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `name` | `query` | no | `array` items: `string` | Filter on case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `new_release_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `order_by` | `query` | no | `array` items: `string` enum: `-genre`, `-label`, `-name`, `-publish_date`, `-release_date`, `-release_id`, `genre`, `label`, `name`, `publish_date`, `release_date`, `release_id` | Order by a field. Choices: publish_date, genre, label, name.             Use -genre for descending order<br/><br/>* `publish_date` - Publish date<br/>* `-publish_date` - Publish date (descending)<br/>* `release_id` - Release id<br/>* `-release_id` - Release id (descending)<br/>* `release_date` - Release date<br/>* `-release_date` - Release date (descending)<br/>* `genre` - Genre<br/>* `-genre` - Genre (descending)<br/>* `label` - Label<br/>* `-label` - Label (descending)<br/>* `name` - Name<br/>* `-name` - Name (descending) |
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |
| `playlists_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |
| `pre_order_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `publish_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `publish_status` | `query` | no | `array` items: `string` | Filter on publish_status exact match<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `release_id` | `query` | no | `array` items: `number` | Filter on exact release ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `release_name` | `query` | no | `array` items: `string` | Filter on case-insensitive release name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `sale_type` | `query` | no | `array` items: `string` | Filter on case-insensitive sale type exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `sub_genre_id` | `query` | no | `array` items: `number` | Filter on case-insensitive sub-genre exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `supplier_id` | `query` | no | `array` items: `number` | Filter on case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `supplier_name` | `query` | no | `array` items: `string` | Filter on case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `track_number` | `query` | no | `array` items: `number` | Filter on exact track_number match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `type` | `query` | no | `array` items: `string` | Filter on track type. Either Release, Album or Mix<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `type_id` | `query` | no | `array` items: `number` | Filter on track release type id<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `was_ever_exclusive` | `query` | no | `string` enum: `false`, `true` | Filter on was_ever_exclusive boolean match.<br/><br/>* `false` - False<br/>* `true` - True |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedPlaylistTrackList` |  |

### GET /v4/catalog/playlists/{playlists_pk}/tracks/facets/
**operationId:** `catalog_playlists_tracks_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `playlists_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PlaylistTrack` |  |

### GET /v4/catalog/playlists/{playlists_pk}/tracks/ids/
**operationId:** `catalog_playlists_tracks_ids_retrieve`
Return a list of `PlaylistTrack` IDs for the given playlist.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `playlists_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PlaylistTrack` |  |

### GET /v4/catalog/releases/
**operationId:** `catalog_releases_list`
A ViewSet Mixin that adds routes for recommendations given one or
many items as a reference. Recommendations only apply to items whose
item_type_id is present in `publish_beatbot`.`source_item_type_id`.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `artist_id` | `query` | no | `array` items: `integer` | Filter by exact artist ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `artist_name` | `query` | no | `array` items: `string` | Filter by case-insensitive artist name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `catalog_number` | `query` | no | `array` items: `string` | Filter by case-insensitive catalog number exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `created` | `query` | no | `string` (format: `date-time`) nullable | Filter by exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `current_status` | `query` | no | `array` items: `number` | Filter on current_status ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `enabled` | `query` | no | `boolean` enum: `false`, `true` | Filter by enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `encoded_date` | `query` | no | `string` (format: `date-time`) nullable | Filter by exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `exclusive` | `query` | no | `boolean` enum: `false`, `true` nullable | Filter by exclusive boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `genre_id` | `query` | no | `array` items: `integer` | Filter by exact genre ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `genre_name` | `query` | no | `array` items: `string` | Filter by case-insensitive genre exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `id` | `query` | no | `array` items: `integer` | Filter by exact ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `is_available_for_streaming` | `query` | no | `boolean` enum: `false`, `true` | Filter on streaming available boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_explicit` | `query` | no | `string` enum: `false`, `true` | Filter on is_explicit boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_hype` | `query` | no | `integer` enum: `false`, `true` | Filter on is_hype boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `label_enabled` | `query` | no | `boolean` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `label_id` | `query` | no | `array` items: `integer` | Filter by exact label ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_name` | `query` | no | `array` items: `string` | Filter by case-insensitive label name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_name_exact` | `query` | no | `array` items: `string` | Filter by case-insensitive label name exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `name` | `query` | no | `array` items: `string` | Filter by case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `new_release_date` | `query` | no | `string` (format: `date`) | Filter by exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `order_by` | `query` | no | `array` items: `string` enum: `-id`, `-label`, `-name`, `-publish_date`, `-release_date`, `-status`, `id`, `label`, `name`, `publish_date`, `release_date`, `status` | Order by a field. Choices: publish_date, release_date, label, name, id             and status. Use -genre for descending order<br/><br/>* `publish_date` - Release Date<br/>* `-publish_date` - Release Date (descending)<br/>* `label` - Label<br/>* `-label` - Label (descending)<br/>* `name` - Release Name<br/>* `-name` - Release Name (descending)<br/>* `id` - Release ID<br/>* `-id` - Release ID (descending)<br/>* `status` - Release Status<br/>* `-status` - Release Status (descending)<br/>* `release_date` - Release date<br/>* `-release_date` - Release date (descending) |
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |
| `pre_order_date` | `query` | no | `string` (format: `date`) nullable | Filter by exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `publish_date` | `query` | no | `string` (format: `date`) | Filter by exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `release_type_id` | `query` | no | `array` items: `integer` | Filter by exact type ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `sub_genre_id` | `query` | no | `array` items: `integer` | Filter by exact sub-genre ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `supplier_id` | `query` | no | `array` items: `integer` | Filter by case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `supplier_name` | `query` | no | `array` items: `string` | Filter by case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `track_id` | `query` | no | `array` items: `integer` | Filter by exact track ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `track_name` | `query` | no | `array` items: `string` | Filter by case-insensitive track name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `type` | `query` | no | `array` items: `string` | Filter on track type. Either Release, Album or Mix<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `type_id` | `query` | no | `array` items: `integer` | Filter on release type id<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `upc` | `query` | no | `array` items: `string` | Filter by exact ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `updated` | `query` | no | `string` (format: `date-time`) nullable | Filter by exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedReleaseListList` |  |

### GET /v4/catalog/releases/facets/
**operationId:** `catalog_releases_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Release` |  |

### GET /v4/catalog/releases/similar/
**operationId:** `catalog_releases_similar_retrieve`
Adds the beatbot list route to the ViewSet
:param request: the Request object
:return: a Response

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Release` |  |

### GET /v4/catalog/releases/top/{num}/
**operationId:** `catalog_releases_top_retrieve`
Return top &lt;N&gt; releases by global most popular rank, where N limited between 1 and 100.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `num` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Release` |  |

### GET /v4/catalog/releases/{id}/
**operationId:** `catalog_releases_retrieve`
A ViewSet Mixin that adds routes for recommendations given one or
many items as a reference. Recommendations only apply to items whose
item_type_id is present in `publish_beatbot`.`source_item_type_id`.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `ReleaseDetail` |  |

### GET /v4/catalog/releases/{id}/beatbot/
**operationId:** `catalog_releases_beatbot_retrieve`
Adds the beatbot detail route to the ViewSet
:param request: the Request object
:param pk: the source item's primary key
:return: a Response

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Release` |  |

### GET /v4/catalog/releases/{id}/images/
**operationId:** `catalog_releases_images_retrieve`
Return this release's images.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Release` |  |

### GET /v4/catalog/releases/{id}/uab/
**operationId:** `catalog_releases_uab_retrieve`
Adds the users-also-bought detail route to the View
:param request: the Request object
:param pk: the source item's primary key
:return: a Response

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Release` |  |

### GET /v4/catalog/releases/{release_pk}/tracks/
**operationId:** `catalog_releases_tracks_list`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |
| `release_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedTrackListList` |  |

### GET /v4/catalog/releases/{release_pk}/tracks/facets/
**operationId:** `catalog_releases_tracks_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `release_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Track` |  |

### GET /v4/catalog/releases/{release_pk}/tracks/ids/
**operationId:** `catalog_releases_tracks_ids_retrieve`
Return a list of `Track` IDs for the given release.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `release_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `ReleaseTrackId` |  |

### GET /v4/catalog/search/
**operationId:** `catalog_search_retrieve`
Search documentation maintained in frontend/js/routes/docs/search.js.

**Security:** `basicAuth`, `cookieAuth`, `oauth2`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | — | — | No response body |

### GET /v4/catalog/search/facets/
**operationId:** `catalog_search_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`, `oauth2`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | — | — | No response body |

### GET /v4/catalog/sub-genres/
**operationId:** `catalog_sub_genres_list`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `enabled` | `query` | no | `boolean` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `name` | `query` | no | `string` | Filter by exact genre name match. |
| `order_by` | `query` | no | `array` items: `string` enum: `-id`, `-status`, `id`, `status` | Ordering<br/><br/>* `id` - SubGenre ID<br/>* `-id` - SubGenre ID (descending)<br/>* `status` - SubGenre Status<br/>* `-status` - SubGenre Status (descending) |
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedSubGenreListList` |  |

### GET /v4/catalog/sub-genres/facets/
**operationId:** `catalog_sub_genres_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `SubGenre` |  |

### GET /v4/catalog/sub-genres/{id}/
**operationId:** `catalog_sub_genres_retrieve`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `SubGenreDetail` |  |

### GET /v4/catalog/sub-genres/{id}/tracks/
**operationId:** `catalog_sub_genres_tracks_retrieve`
Return this sub-genre's tracks

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `SubGenre` |  |

### GET /v4/catalog/tracks/
**operationId:** `catalog_tracks_list`
A ViewSet Mixin that adds routes for recommendations given one or
many items as a reference. Recommendations only apply to items whose
item_type_id is present in `publish_beatbot`.`source_item_type_id`.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `artist_id` | `query` | no | `array` items: `integer` | Filter on artist ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `artist_name` | `query` | no | `array` items: `string` | Filter on case-insensitive artist name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `available_worldwide` | `query` | no | `boolean` enum: `false`, `true` | Filter on available worldwide boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `bpm` | `query` | no | `integer` nullable min: -32768, max: 32767 | Filter on exact, less/greater than equal and range. |
| `catalog_number` | `query` | no | `array` items: `string` | Filter on case-insensitive catalog_number exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `change_date` | `query` | no | `string` (format: `date-time`) nullable | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `chord_type_id` | `query` | no | `array` items: `integer` | Filter on exact key ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `current_status` | `query` | no | `array` items: `number` | Filter on current_status ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `enabled` | `query` | no | `boolean` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `encode_status` | `query` | no | `array` items: `string` | Filter on case-insensitive encode status exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `encoded_date` | `query` | no | `string` (format: `date-time`) | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `exclusive_date` | `query` | no | `string` (format: `date`) nullable | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `exclusive_period` | `query` | no | `array` items: `integer` | Filter on case-insensitive exclusive period exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `free_download_end_date` | `query` | no | `string` (format: `date`) nullable | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `free_download_start_date` | `query` | no | `string` (format: `date`) nullable | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `genre_enabled` | `query` | no | `string` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `genre_id` | `query` | no | `array` items: `integer` | Filter on genre ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `genre_name` | `query` | no | `array` items: `string` | Filter on case-insensitive genre exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `guid` | `query` | no | `array` items: `string` | filter on exact guid match<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `id` | `query` | no | `array` items: `integer` | Filter on ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `is_available_for_streaming` | `query` | no | `boolean` enum: `false`, `true` | Filter on streaming available boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_classic` | `query` | no | `boolean` enum: `false`, `true` | Filter on is_classic boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_explicit` | `query` | no | `boolean` enum: `false`, `true` | Filter on is_explicit boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_hype` | `query` | no | `boolean` enum: `false`, `true` | Filter on is_hype boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `isrc` | `query` | no | `array` items: `string` | Filter on exact ISRC match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `key_id` | `query` | no | `array` items: `number` | Filter on exact key ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `key_name` | `query` | no | `array` items: `string` | <br/>            Filter key. Denote sharp as #, flat as b with minor/major separated by a space.<br/>            Available Keys:<br/>                "A Minor"<br/>                "A Major"<br/>                "Ab Minor"<br/>                "Ab Major"<br/>                "A# Minor"<br/>                "A# Major"<br/>                "B Minor"<br/>                "B Major"<br/>                "Bb Minor"<br/>                "Bb Major"<br/>                "C Minor"<br/>                "C Major"<br/>                "C# Minor"<br/>                "C# Major"<br/>                "D Minor"<br/>                "D Major"<br/>                "Db Minor"<br/>                "Db Major"<br/>                "D# Minor"<br/>                "D# Major"<br/>                "E Minor"<br/>                "E Major"<br/>                "Eb Minor"<br/>                "Eb Major"<br/>                "F Minor"<br/>                "F Major"<br/>                "F# Minor"<br/>                "F# Major"<br/>                "G Minor"<br/>                "G Major"<br/>                "Gb Minor"<br/>                "Gb Major"<br/>                "G# Minor"<br/>                "G# Major"<br/>            <br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_enabled` | `query` | no | `boolean` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `label_id` | `query` | no | `array` items: `integer` | Filter on label ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_manager` | `query` | no | `string` | Filter by case-insensitive Label Manager name containment. |
| `label_name` | `query` | no | `array` items: `string` | Filter on case-insensitive label name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_name_exact` | `query` | no | `array` items: `string` | Filter on case-insensitive label name exact.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `mix_name` | `query` | no | `array` items: `string` | Filter on case-insensitive remix name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `name` | `query` | no | `array` items: `string` | Filter on case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `new_release_date` | `query` | no | `string` (format: `date`) | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `order_by` | `query` | no | `array` items: `string` enum: `-genre`, `-label`, `-name`, `-publish_date`, `-release_date`, `-release_id`, `genre`, `label`, `name`, `publish_date`, `release_date`, `release_id` | Order by a field. Choices: publish_date, genre, label, name.             Use -genre for descending order<br/><br/>* `publish_date` - Publish date<br/>* `-publish_date` - Publish date (descending)<br/>* `release_id` - Release id<br/>* `-release_id` - Release id (descending)<br/>* `release_date` - Release date<br/>* `-release_date` - Release date (descending)<br/>* `genre` - Genre<br/>* `-genre` - Genre (descending)<br/>* `label` - Label<br/>* `-label` - Label (descending)<br/>* `name` - Name<br/>* `-name` - Name (descending) |
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |
| `pre_order_date` | `query` | no | `string` (format: `date`) nullable | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `publish_date` | `query` | no | `string` (format: `date`) | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `publish_status` | `query` | no | `array` items: `string` | Filter on publish_status exact match<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `release_id` | `query` | no | `array` items: `number` | Filter on exact release ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `release_name` | `query` | no | `array` items: `string` | Filter on case-insensitive release name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `sale_type` | `query` | no | `array` items: `string` | Filter on case-insensitive sale type exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `sub_genre_id` | `query` | no | `array` items: `number` | Filter on case-insensitive sub-genre exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `supplier_id` | `query` | no | `array` items: `integer` | Filter on case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `supplier_name` | `query` | no | `array` items: `string` | Filter on case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `track_number` | `query` | no | `array` items: `integer` | Filter on exact track_number match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `type` | `query` | no | `array` items: `string` | Filter on track type. Either Release, Album or Mix<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `type_id` | `query` | no | `array` items: `integer` | Filter on track release type id<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `was_ever_exclusive` | `query` | no | `boolean` enum: `false`, `true` | Filter on was_ever_exclusive boolean match.<br/><br/>* `false` - False<br/>* `true` - True |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedTrackListList` |  |

### GET /v4/catalog/tracks/facets/
**operationId:** `catalog_tracks_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Track` |  |

### GET /v4/catalog/tracks/similar/
**operationId:** `catalog_tracks_similar_retrieve`
Adds the beatbot list route to the ViewSet
:param request: the Request object
:return: a Response

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Track` |  |

### GET /v4/catalog/tracks/store/{isrc}/
**operationId:** `catalog_tracks_store_retrieve`
Return the store url for a track given the correct isrc.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `isrc` | `path` | yes | `string` | The ISRC of the track |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `OK` | 200 |

### GET /v4/catalog/tracks/top/{num}/
**operationId:** `catalog_tracks_top_retrieve`
Return top &lt;N&gt; tracks by global most popular rank, where N limited between 1 and 100.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `num` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Track` |  |

### GET /v4/catalog/tracks/{id}/
**operationId:** `catalog_tracks_retrieve`
Return a territory restricted track.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `TrackDetail` |  |

### GET /v4/catalog/tracks/{id}/audio-files/
**operationId:** `catalog_tracks_audio_files_retrieve`
Return track audio files.

Adds create [POST] helper route, unless provided in request body,
this assumes the file is on disk and has been successfully encoded.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Track` |  |

### GET /v4/catalog/tracks/{id}/beatbot/
**operationId:** `catalog_tracks_beatbot_retrieve`
Adds the beatbot detail route to the ViewSet
:param request: the Request object
:param pk: the source item's primary key
:return: a Response

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Track` |  |

### GET /v4/catalog/tracks/{id}/images/
**operationId:** `catalog_tracks_images_retrieve`
Return this track's images.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Track` |  |

### GET /v4/catalog/tracks/{id}/publishers/
**operationId:** `catalog_tracks_publishers_retrieve`
Return this Track's Publishers, updating if necessary

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Track` |  |

### GET /v4/catalog/tracks/{id}/stream-sdk/
**operationId:** `catalog_tracks_stream_sdk_retrieve`
A ViewSet Mixin that adds routes for recommendations given one or
many items as a reference. Recommendations only apply to items whose
item_type_id is present in `publish_beatbot`.`source_item_type_id`.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Track` |  |

### GET /v4/catalog/tracks/{id}/uab/
**operationId:** `catalog_tracks_uab_retrieve`
Adds the users-also-bought detail route to the View
:param request: the Request object
:param pk: the source item's primary key
:return: a Response

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Track` |  |


## curation
### GET /v4/curation/playlists/
**operationId:** `curation_playlists_list`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `artist_name` | `query` | no | `array` items: `string` | Filter on the artist name<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `created_date` | `query` | no | `string` (format: `date-time`) nullable | Filter on date range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `genre_id` | `query` | no | `array` items: `integer` | Filter on Genre ID<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `genre_name` | `query` | no | `array` items: `string` | Filter on Genre name<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `id` | `query` | no | `array` items: `integer` | Filter by exact ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `is_public` | `query` | no | `boolean` enum: `false`, `true` | * `false` - False<br/>* `true` - True |
| `name` | `query` | no | `array` items: `string` | Filter on Playlist name<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `order_by` | `query` | no | `array` items: `string` enum: `-create_date`, `-name`, `-update_date`, `create_date`, `name`, `update_date` | Order by a field. Choices: created_date, name, updated_date.             Use -created_datefor descending order<br/><br/>* `create_date` - Create date<br/>* `-create_date` - Create date (descending)<br/>* `update_date` - Update date<br/>* `-update_date` - Update date (descending)<br/>* `name` - Name<br/>* `-name` - Name (descending) |
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |
| `playlist_status` | `query` | no | `boolean` enum: `false`, `true` | * `false` - False<br/>* `true` - True |
| `playlist_type` | `query` | no | `array` items: `string` | Filter on Playlist name<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `playlist_type_id` | `query` | no | `array` items: `string` | Filter on Playlist ID<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `status` | `query` | no | `boolean` enum: `false`, `true` | * `false` - False<br/>* `true` - True |
| `updated_date` | `query` | no | `string` (format: `date-time`) nullable | Filter on date range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `user_id` | `query` | no | `array` items: `integer` | Filter by exact user ID.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `username` | `query` | no | `array` items: `string` | Filter by case-insensitive username containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedCuratedPlaylistList` |  |

### GET /v4/curation/playlists/facets/
**operationId:** `curation_playlists_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `CuratedPlaylist` |  |

### GET /v4/curation/playlists/{curatedplaylist_pk}/tracks/
**operationId:** `curation_playlists_tracks_list`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `artist_id` | `query` | no | `array` items: `number` | Filter on artist ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `artist_name` | `query` | no | `array` items: `string` | Filter on case-insensitive artist name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `available_worldwide` | `query` | no | `string` enum: `false`, `true` | Filter on available worldwide boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `bpm` | `query` | no | `string` | Filter on exact, less/greater than equal and range. |
| `catalog_number` | `query` | no | `array` items: `string` | Filter on case-insensitive catalog_number exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `change_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `chord_type_id` | `query` | no | `array` items: `number` | Filter on exact key ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `curatedplaylist_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |
| `current_status` | `query` | no | `array` items: `number` | Filter on current_status ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `enabled` | `query` | no | `string` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `encode_status` | `query` | no | `array` items: `string` | Filter on case-insensitive encode status exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `encoded_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `exclusive_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `exclusive_period` | `query` | no | `array` items: `number` | Filter on case-insensitive exclusive period exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `free_download_end_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `free_download_start_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `genre_enabled` | `query` | no | `string` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `genre_id` | `query` | no | `array` items: `number` | Filter on genre ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `genre_name` | `query` | no | `array` items: `string` | Filter on case-insensitive genre exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `guid` | `query` | no | `array` items: `string` | filter on exact guid match<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `id` | `query` | no | `array` items: `integer` | Filter on ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `is_available_for_streaming` | `query` | no | `string` enum: `false`, `true` | Filter on streaming available boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_classic` | `query` | no | `string` enum: `false`, `true` | Filter on is_classic boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_explicit` | `query` | no | `string` enum: `false`, `true` | Filter on is_explicit boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_hype` | `query` | no | `string` enum: `false`, `true` | Filter on is_hype boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `isrc` | `query` | no | `array` items: `string` | Filter on exact ISRC match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `key_id` | `query` | no | `array` items: `number` | Filter on exact key ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `key_name` | `query` | no | `array` items: `string` | <br/>            Filter key. Denote sharp as #, flat as b with minor/major separated by a space.<br/>            Available Keys:<br/>                "A Minor"<br/>                "A Major"<br/>                "Ab Minor"<br/>                "Ab Major"<br/>                "A# Minor"<br/>                "A# Major"<br/>                "B Minor"<br/>                "B Major"<br/>                "Bb Minor"<br/>                "Bb Major"<br/>                "C Minor"<br/>                "C Major"<br/>                "C# Minor"<br/>                "C# Major"<br/>                "D Minor"<br/>                "D Major"<br/>                "Db Minor"<br/>                "Db Major"<br/>                "D# Minor"<br/>                "D# Major"<br/>                "E Minor"<br/>                "E Major"<br/>                "Eb Minor"<br/>                "Eb Major"<br/>                "F Minor"<br/>                "F Major"<br/>                "F# Minor"<br/>                "F# Major"<br/>                "G Minor"<br/>                "G Major"<br/>                "Gb Minor"<br/>                "Gb Major"<br/>                "G# Minor"<br/>                "G# Major"<br/>            <br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_enabled` | `query` | no | `string` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `label_id` | `query` | no | `array` items: `number` | Filter on label ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_manager` | `query` | no | `string` | Filter by case-insensitive Label Manager name containment. |
| `label_name` | `query` | no | `array` items: `string` | Filter on case-insensitive label name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_name_exact` | `query` | no | `array` items: `string` | Filter on case-insensitive label name exact.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `mix_name` | `query` | no | `array` items: `string` | Filter on case-insensitive remix name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `name` | `query` | no | `array` items: `string` | Filter on case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `new_release_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `order_by` | `query` | no | `array` items: `string` enum: `-genre`, `-label`, `-name`, `-publish_date`, `-release_date`, `-release_id`, `genre`, `label`, `name`, `publish_date`, `release_date`, `release_id` | Order by a field. Choices: publish_date, genre, label, name.             Use -genre for descending order<br/><br/>* `publish_date` - Publish date<br/>* `-publish_date` - Publish date (descending)<br/>* `release_id` - Release id<br/>* `-release_id` - Release id (descending)<br/>* `release_date` - Release date<br/>* `-release_date` - Release date (descending)<br/>* `genre` - Genre<br/>* `-genre` - Genre (descending)<br/>* `label` - Label<br/>* `-label` - Label (descending)<br/>* `name` - Name<br/>* `-name` - Name (descending) |
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |
| `pre_order_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `publish_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `publish_status` | `query` | no | `array` items: `string` | Filter on publish_status exact match<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `release_id` | `query` | no | `array` items: `number` | Filter on exact release ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `release_name` | `query` | no | `array` items: `string` | Filter on case-insensitive release name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `sale_type` | `query` | no | `array` items: `string` | Filter on case-insensitive sale type exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `sub_genre_id` | `query` | no | `array` items: `number` | Filter on case-insensitive sub-genre exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `supplier_id` | `query` | no | `array` items: `number` | Filter on case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `supplier_name` | `query` | no | `array` items: `string` | Filter on case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `track_number` | `query` | no | `array` items: `number` | Filter on exact track_number match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `type` | `query` | no | `array` items: `string` | Filter on track type. Either Release, Album or Mix<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `type_id` | `query` | no | `array` items: `number` | Filter on track release type id<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `was_ever_exclusive` | `query` | no | `string` enum: `false`, `true` | Filter on was_ever_exclusive boolean match.<br/><br/>* `false` - False<br/>* `true` - True |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedPlaylistTrackList` |  |

### GET /v4/curation/playlists/{curatedplaylist_pk}/tracks/facets/
**operationId:** `curation_playlists_tracks_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `curatedplaylist_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PlaylistTrack` |  |

### GET /v4/curation/playlists/{curatedplaylist_pk}/tracks/{id}/
**operationId:** `curation_playlists_tracks_retrieve`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `curatedplaylist_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PlaylistTrack` |  |

### GET /v4/curation/playlists/{id}/
**operationId:** `curation_playlists_retrieve`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PlaylistProxy` |  |


## db-health-check
### GET /v4/db-health-check/
**operationId:** `db_health_check_retrieve`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | — | — | No response body |


## health-check
### GET /v4/health-check/
**operationId:** `health_check_retrieve`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | — | — | No response body |


## my
### GET /v4/my/account/
**operationId:** `my_account_list`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedPersonAccountList` |  |

### GET /v4/my/account/facets/
**operationId:** `my_account_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PersonAccountUpdate` |  |

### PATCH /v4/my/account/myaccount/
**operationId:** `my_account_myaccount_partial_update`

**Request Body**
- required: no
  - `application/json`: `PatchedPersonAccountUpdate`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PersonAccountUpdate` |  |

### PUT /v4/my/account/myaccount/
**operationId:** `my_account_myaccount_update`

**Request Body**
- required: yes
  - `application/json`: `PersonAccountUpdate`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PersonAccountUpdate` |  |

### PATCH /v4/my/account/{id}/
**operationId:** `my_account_partial_update`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Request Body**
- required: no
  - `application/json`: `PatchedPersonAccountUpdate`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PersonAccountUpdate` |  |

### PUT /v4/my/account/{id}/
**operationId:** `my_account_update`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Request Body**
- required: yes
  - `application/json`: `PersonAccountUpdate`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PersonAccountUpdate` |  |

### GET /v4/my/beatport/
**operationId:** `my_beatport_list`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `item_publish_date` | `query` | no | `string` (format: `date-time`) | Filter on date range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |
| `publish_date` | `query` | no | `string` (format: `date-time`) | Filter on date range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |

**Security:** `basicAuth`, `cookieAuth`, `oauth2`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedMyBeatportListList` |  |

### POST /v4/my/beatport/
**operationId:** `my_beatport_create`
Create subscription entries for the requesting user for the provided
artist or label ids.

**Request Body**
- required: yes
  - `application/json`: `MyBeatportList`
  - `application/x-www-form-urlencoded`: `MyBeatportList`

**Security:** `basicAuth`, `cookieAuth`, `oauth2`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 201 | `application/json` | `MyBeatportList` |  |

### GET /v4/my/beatport/artists/
**operationId:** `my_beatport_artists_retrieve`

**Security:** `basicAuth`, `cookieAuth`, `oauth2`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `MyBeatportList` |  |

### DELETE /v4/my/beatport/delete/
**operationId:** `my_beatport_delete_destroy`
Delete subscription entries for the requesting user for the provided
artist or label ids.

**Security:** `basicAuth`, `cookieAuth`, `oauth2`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 204 | — | — | No response body |

### GET /v4/my/beatport/facets/
**operationId:** `my_beatport_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`, `oauth2`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `MyBeatportList` |  |

### GET /v4/my/beatport/labels/
**operationId:** `my_beatport_labels_retrieve`

**Security:** `basicAuth`, `cookieAuth`, `oauth2`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `MyBeatportList` |  |

### GET /v4/my/beatport/playlists/
**operationId:** `my_beatport_playlists_retrieve`

**Security:** `basicAuth`, `cookieAuth`, `oauth2`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `MyBeatportList` |  |

### GET /v4/my/beatport/tracks/
**operationId:** `my_beatport_tracks_retrieve`

**Security:** `basicAuth`, `cookieAuth`, `oauth2`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `MyBeatportList` |  |

### POST /v4/my/beatport/tracks/
**operationId:** `my_beatport_tracks_create`

**Request Body**
- required: yes
  - `application/json`: `MyBeatportList`
  - `application/x-www-form-urlencoded`: `MyBeatportList`

**Security:** `basicAuth`, `cookieAuth`, `oauth2`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `MyBeatportList` |  |

### GET /v4/my/charts/
**operationId:** `my_charts_list`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `add_date` | `query` | no | `string` (format: `date-time`) nullable | Filter by date added.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `curated_playlist_genre_id` | `query` | no | `array` items: `integer` | Filter on genre ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `dj_id` | `query` | no | `array` items: `integer` | Filter by the exact dj profile id.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `dj_name` | `query` | no | `array` items: `string` | Filter by case-insensitive DJ name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `dj_slug` | `query` | no | `array` items: `string` | Filter by case-insensitive DJ slug containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `enabled` | `query` | no | `boolean` enum: `false`, `true` | Filter by enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `genre_id` | `query` | no | `array` items: `number` | Filter on genre ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `genre_name` | `query` | no | `array` items: `string` | Filter on case-insensitive genre exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `id` | `query` | no | `array` items: `integer` | Filter by exact chart ID.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `is_approved` | `query` | no | `boolean` enum: `false`, `true` | Filter by approved boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_curated_playlist` | `query` | no | `integer` | Filter by is curated playlist boolean match. |
| `is_indexed` | `query` | no | `boolean` enum: `false`, `true` | Filter by indexed boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_published` | `query` | no | `boolean` enum: `false`, `true` | Filter by published boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `name` | `query` | no | `array` items: `string` | Filter by case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |
| `publish_date` | `query` | no | `string` (format: `date-time`) nullable | Filter by date published.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `register_ip_address` | `query` | no | `integer` (format: `int64`) min: -9223372036854775808, max: 9223372036854775807 | Filter by exact registration IP address match. |
| `sub_genre_id` | `query` | no | `array` items: `number` | Filter on sub genre ID.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `sub_genre_name` | `query` | no | `array` items: `string` | Filter on case-insensitive sub_genre name<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `track_id` | `query` | no | `array` items: `number` | Filter on track_id.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `updated` | `query` | no | `string` (format: `date-time`) | Filter by date added.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `user_id` | `query` | no | `array` items: `integer` | Filter by exact user ID.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `username` | `query` | no | `array` items: `string` | Filter by case-insensitive username containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedChartListList` |  |

### POST /v4/my/charts/
**operationId:** `my_charts_create`

**Request Body**
- required: yes
  - `application/json`: `MyChartCreateUpdate`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 201 | `application/json` | `MyChartCreateUpdate` |  |

### GET /v4/my/charts/facets/
**operationId:** `my_charts_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Chart` |  |

### DELETE /v4/my/charts/{id}/
**operationId:** `my_charts_destroy`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 204 | — | — | No response body |

### GET /v4/my/charts/{id}/
**operationId:** `my_charts_retrieve`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `ChartDetail` |  |

### PATCH /v4/my/charts/{id}/
**operationId:** `my_charts_partial_update`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Request Body**
- required: no
  - `application/json`: `PatchedMyChartCreateUpdate`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `MyChartCreateUpdate` |  |

### PUT /v4/my/charts/{id}/
**operationId:** `my_charts_update`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Request Body**
- required: yes
  - `application/json`: `MyChartCreateUpdate`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `MyChartCreateUpdate` |  |

### GET /v4/my/charts/{id}/images/
**operationId:** `my_charts_images_retrieve`
Return/create this chart's images.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Chart` |  |

### POST /v4/my/charts/{id}/images/
**operationId:** `my_charts_images_create`
Return/create this chart's images.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Request Body**
- required: yes
  - `application/json`: `Chart`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Chart` |  |

### GET /v4/my/charts/{mycharts_pk}/tracks/
**operationId:** `my_charts_tracks_list`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `mycharts_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedChartTrackList` |  |

### POST /v4/my/charts/{mycharts_pk}/tracks/
**operationId:** `my_charts_tracks_create`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `mycharts_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Request Body**
- required: no
  - `application/json`: `MyChartTrackCreateUpdate`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 201 | `application/json` | `MyChartTrackCreateUpdate` |  |

### GET /v4/my/charts/{mycharts_pk}/tracks/facets/
**operationId:** `my_charts_tracks_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `mycharts_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `ChartTrack` |  |

### DELETE /v4/my/charts/{mycharts_pk}/tracks/{id}/
**operationId:** `my_charts_tracks_destroy`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |
| `mycharts_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 204 | — | — | No response body |

### PATCH /v4/my/charts/{mycharts_pk}/tracks/{id}/
**operationId:** `my_charts_tracks_partial_update`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |
| `mycharts_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Request Body**
- required: no
  - `application/json`: `PatchedMyChartTrackCreateUpdate`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `MyChartTrackCreateUpdate` |  |

### PUT /v4/my/charts/{mycharts_pk}/tracks/{id}/
**operationId:** `my_charts_tracks_update`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |
| `mycharts_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Request Body**
- required: no
  - `application/json`: `MyChartTrackCreateUpdate`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `MyChartTrackCreateUpdate` |  |

### GET /v4/my/downloads/
**operationId:** `my_downloads_list`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `artist_id` | `query` | no | `array` items: `integer` | Filter on artist ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `artist_name` | `query` | no | `array` items: `string` | Filter on case-insensitive artist name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `available_worldwide` | `query` | no | `boolean` enum: `false`, `true` | Filter on available worldwide boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `bpm` | `query` | no | `integer` nullable min: -32768, max: 32767 | Filter on exact, less/greater than equal and range. |
| `catalog_number` | `query` | no | `array` items: `string` | Filter on case-insensitive catalog_number exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `change_date` | `query` | no | `string` (format: `date-time`) nullable | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `chord_type_id` | `query` | no | `array` items: `integer` | Filter on exact key ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `current_status` | `query` | no | `array` items: `number` | Filter on current_status ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `enabled` | `query` | no | `boolean` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `encode_status` | `query` | no | `array` items: `string` | Filter on case-insensitive encode status exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `encoded_date` | `query` | no | `string` (format: `date-time`) | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `exclusive_date` | `query` | no | `string` (format: `date`) nullable | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `exclusive_period` | `query` | no | `array` items: `integer` | Filter on case-insensitive exclusive period exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `free_download_end_date` | `query` | no | `string` (format: `date`) nullable | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `free_download_start_date` | `query` | no | `string` (format: `date`) nullable | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `genre_enabled` | `query` | no | `string` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `genre_id` | `query` | no | `array` items: `integer` | Filter on genre ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `genre_name` | `query` | no | `array` items: `string` | Filter on case-insensitive genre exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `guid` | `query` | no | `array` items: `string` | filter on exact guid match<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `id` | `query` | no | `array` items: `integer` | Filter on ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `is_available_for_streaming` | `query` | no | `boolean` enum: `false`, `true` | Filter on streaming available boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_classic` | `query` | no | `boolean` enum: `false`, `true` | Filter on is_classic boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_explicit` | `query` | no | `boolean` enum: `false`, `true` | Filter on is_explicit boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_hype` | `query` | no | `boolean` enum: `false`, `true` | Filter on is_hype boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `isrc` | `query` | no | `array` items: `string` | Filter on exact ISRC match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `key_id` | `query` | no | `array` items: `number` | Filter on exact key ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `key_name` | `query` | no | `array` items: `string` | <br/>            Filter key. Denote sharp as #, flat as b with minor/major separated by a space.<br/>            Available Keys:<br/>                "A Minor"<br/>                "A Major"<br/>                "Ab Minor"<br/>                "Ab Major"<br/>                "A# Minor"<br/>                "A# Major"<br/>                "B Minor"<br/>                "B Major"<br/>                "Bb Minor"<br/>                "Bb Major"<br/>                "C Minor"<br/>                "C Major"<br/>                "C# Minor"<br/>                "C# Major"<br/>                "D Minor"<br/>                "D Major"<br/>                "Db Minor"<br/>                "Db Major"<br/>                "D# Minor"<br/>                "D# Major"<br/>                "E Minor"<br/>                "E Major"<br/>                "Eb Minor"<br/>                "Eb Major"<br/>                "F Minor"<br/>                "F Major"<br/>                "F# Minor"<br/>                "F# Major"<br/>                "G Minor"<br/>                "G Major"<br/>                "Gb Minor"<br/>                "Gb Major"<br/>                "G# Minor"<br/>                "G# Major"<br/>            <br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_enabled` | `query` | no | `boolean` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `label_id` | `query` | no | `array` items: `integer` | Filter on label ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_manager` | `query` | no | `string` | Filter by case-insensitive Label Manager name containment. |
| `label_name` | `query` | no | `array` items: `string` | Filter on case-insensitive label name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_name_exact` | `query` | no | `array` items: `string` | Filter on case-insensitive label name exact.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `mix_name` | `query` | no | `array` items: `string` | Filter on case-insensitive remix name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `name` | `query` | no | `array` items: `string` | Filter on case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `new_release_date` | `query` | no | `string` (format: `date`) | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `order_by` | `query` | no | `array` items: `string` enum: `-genre`, `-label`, `-name`, `-publish_date`, `-release_date`, `-release_id`, `genre`, `label`, `name`, `publish_date`, `release_date`, `release_id` | Order by a field. Choices: publish_date, genre, label, name.             Use -genre for descending order<br/><br/>* `publish_date` - Publish date<br/>* `-publish_date` - Publish date (descending)<br/>* `release_id` - Release id<br/>* `-release_id` - Release id (descending)<br/>* `release_date` - Release date<br/>* `-release_date` - Release date (descending)<br/>* `genre` - Genre<br/>* `-genre` - Genre (descending)<br/>* `label` - Label<br/>* `-label` - Label (descending)<br/>* `name` - Name<br/>* `-name` - Name (descending) |
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |
| `pre_order_date` | `query` | no | `string` (format: `date`) nullable | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `publish_date` | `query` | no | `string` (format: `date`) | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `publish_status` | `query` | no | `array` items: `string` | Filter on publish_status exact match<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `purchase_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `received_status` | `query` | no | `string` enum: `false`, `true` | Filter on download received status boolean.<br/><br/>* `false` - False<br/>* `true` - True |
| `release_id` | `query` | no | `array` items: `number` | Filter on exact release ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `release_name` | `query` | no | `array` items: `string` | Filter on case-insensitive release name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `sale_type` | `query` | no | `array` items: `string` | Filter on case-insensitive sale type exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `sub_genre_id` | `query` | no | `array` items: `number` | Filter on case-insensitive sub-genre exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `supplier_id` | `query` | no | `array` items: `integer` | Filter on case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `supplier_name` | `query` | no | `array` items: `string` | Filter on case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `track_number` | `query` | no | `array` items: `integer` | Filter on exact track_number match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `type` | `query` | no | `array` items: `string` | Filter on track type. Either Release, Album or Mix<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `type_id` | `query` | no | `array` items: `integer` | Filter on track release type id<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `was_ever_exclusive` | `query` | no | `boolean` enum: `false`, `true` | Filter on was_ever_exclusive boolean match.<br/><br/>* `false` - False<br/>* `true` - True |

**Security:** `basicAuth`, `cookieAuth`, `oauth2`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedTrackDownloadListList` |  |

### GET /v4/my/downloads/encode-status/
**operationId:** `my_downloads_encode_status_retrieve`

**Security:** `basicAuth`, `cookieAuth`, `oauth2`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | — | — | No response body |

### GET /v4/my/downloads/encode-status/facets/
**operationId:** `my_downloads_encode_status_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`, `oauth2`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | — | — | No response body |

### GET /v4/my/downloads/facets/
**operationId:** `my_downloads_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`, `oauth2`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `TrackDownloadList` |  |

### GET /v4/my/email-preferences/
**operationId:** `my_email_preferences_retrieve`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | — | — | No response body |

### GET /v4/my/email-preferences/facets/
**operationId:** `my_email_preferences_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | — | — | No response body |

### PATCH /v4/my/email-preferences/{id}/
**operationId:** `my_email_preferences_partial_update`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | — | — | No response body |

### GET /v4/my/genres/
**operationId:** `my_genres_list`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedGenreListList` |  |

### POST /v4/my/genres/
**operationId:** `my_genres_create`

**Request Body**
- required: yes
  - `application/json`: `GenreSubscribe`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 201 | `application/json` | `GenreSubscribe` |  |

### GET /v4/my/genres/facets/
**operationId:** `my_genres_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `GenreDetail` |  |

### DELETE /v4/my/genres/{id}/
**operationId:** `my_genres_destroy`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 204 | — | — | No response body |

### GET /v4/my/playlists/
**operationId:** `my_playlists_list`
Return list of Playlists belonging to authenticated user.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedPlaylistProxyList` |  |

### POST /v4/my/playlists/
**operationId:** `my_playlists_create`
Create a Playlist for the request User.

**Request Body**
- required: yes
  - `POST_PATCH`: `Request_body`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Playlist_metadata_response` | 200 |

### PATCH /v4/my/playlists/bulk/
**operationId:** `my_playlists_bulk_partial_update`
Update playlist positions.

**Request Body**
- required: no
  - `application/json`: `PatchedPlaylistBulkUpdate`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PlaylistBulkUpdate` |  |

### GET /v4/my/playlists/facets/
**operationId:** `my_playlists_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Playlist` |  |

### DELETE /v4/my/playlists/{id}/
**operationId:** `my_playlists_destroy`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 204 | — | — | No response body |

### GET /v4/my/playlists/{id}/
**operationId:** `my_playlists_retrieve`
Return a Playlist.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Playlist_metadata_response` | 200 |

### PATCH /v4/my/playlists/{id}/
**operationId:** `my_playlists_partial_update`
Update a Playlist for the request User.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Request Body**
- required: no
  - `POST_PATCH`: `PatchedRequest_body`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Playlist_metadata_response` | 200 |

### GET /v4/my/playlists/{myplaylists_pk}/tracks/
**operationId:** `my_playlists_tracks_list`
Return a list of `PlaylistTrack` objects for the given playlist.

The `PlaylistTrack` has a computed value "tombstoned" which indicates if the track was
added to a LINK playlist but is no longer available for LINK. The track remains in the
user's playlist but isn't streamable.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `artist_id` | `query` | no | `array` items: `number` | Filter on artist ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `artist_name` | `query` | no | `array` items: `string` | Filter on case-insensitive artist name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `available_worldwide` | `query` | no | `string` enum: `false`, `true` | Filter on available worldwide boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `bpm` | `query` | no | `string` | Filter on exact, less/greater than equal and range. |
| `catalog_number` | `query` | no | `array` items: `string` | Filter on case-insensitive catalog_number exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `change_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `chord_type_id` | `query` | no | `array` items: `number` | Filter on exact key ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `current_status` | `query` | no | `array` items: `number` | Filter on current_status ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `enabled` | `query` | no | `string` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `encode_status` | `query` | no | `array` items: `string` | Filter on case-insensitive encode status exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `encoded_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `exclusive_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `exclusive_period` | `query` | no | `array` items: `number` | Filter on case-insensitive exclusive period exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `free_download_end_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `free_download_start_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `genre_enabled` | `query` | no | `string` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `genre_id` | `query` | no | `array` items: `number` | Filter on genre ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `genre_name` | `query` | no | `array` items: `string` | Filter on case-insensitive genre exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `guid` | `query` | no | `array` items: `string` | filter on exact guid match<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `id` | `query` | no | `array` items: `integer` | Filter on ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `is_available_for_streaming` | `query` | no | `string` enum: `false`, `true` | Filter on streaming available boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_classic` | `query` | no | `string` enum: `false`, `true` | Filter on is_classic boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_explicit` | `query` | no | `string` enum: `false`, `true` | Filter on is_explicit boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `is_hype` | `query` | no | `string` enum: `false`, `true` | Filter on is_hype boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `isrc` | `query` | no | `array` items: `string` | Filter on exact ISRC match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `key_id` | `query` | no | `array` items: `number` | Filter on exact key ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `key_name` | `query` | no | `array` items: `string` | <br/>            Filter key. Denote sharp as #, flat as b with minor/major separated by a space.<br/>            Available Keys:<br/>                "A Minor"<br/>                "A Major"<br/>                "Ab Minor"<br/>                "Ab Major"<br/>                "A# Minor"<br/>                "A# Major"<br/>                "B Minor"<br/>                "B Major"<br/>                "Bb Minor"<br/>                "Bb Major"<br/>                "C Minor"<br/>                "C Major"<br/>                "C# Minor"<br/>                "C# Major"<br/>                "D Minor"<br/>                "D Major"<br/>                "Db Minor"<br/>                "Db Major"<br/>                "D# Minor"<br/>                "D# Major"<br/>                "E Minor"<br/>                "E Major"<br/>                "Eb Minor"<br/>                "Eb Major"<br/>                "F Minor"<br/>                "F Major"<br/>                "F# Minor"<br/>                "F# Major"<br/>                "G Minor"<br/>                "G Major"<br/>                "Gb Minor"<br/>                "Gb Major"<br/>                "G# Minor"<br/>                "G# Major"<br/>            <br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_enabled` | `query` | no | `string` enum: `false`, `true` | Filter on enabled boolean match.<br/><br/>* `false` - False<br/>* `true` - True |
| `label_id` | `query` | no | `array` items: `number` | Filter on label ID exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_manager` | `query` | no | `string` | Filter by case-insensitive Label Manager name containment. |
| `label_name` | `query` | no | `array` items: `string` | Filter on case-insensitive label name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `label_name_exact` | `query` | no | `array` items: `string` | Filter on case-insensitive label name exact.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `mix_name` | `query` | no | `array` items: `string` | Filter on case-insensitive remix name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `myplaylists_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |
| `name` | `query` | no | `array` items: `string` | Filter on case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `new_release_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `order_by` | `query` | no | `array` items: `string` enum: `-genre`, `-label`, `-name`, `-publish_date`, `-release_date`, `-release_id`, `genre`, `label`, `name`, `publish_date`, `release_date`, `release_id` | Order by a field. Choices: publish_date, genre, label, name.             Use -genre for descending order<br/><br/>* `publish_date` - Publish date<br/>* `-publish_date` - Publish date (descending)<br/>* `release_id` - Release id<br/>* `-release_id` - Release id (descending)<br/>* `release_date` - Release date<br/>* `-release_date` - Release date (descending)<br/>* `genre` - Genre<br/>* `-genre` - Genre (descending)<br/>* `label` - Label<br/>* `-label` - Label (descending)<br/>* `name` - Name<br/>* `-name` - Name (descending) |
| `page` | `query` | no | `integer` | A page number within the paginated result set. |
| `per_page` | `query` | no | `integer` | Number of results to return per page. |
| `pre_order_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `publish_date` | `query` | no | `string` | Filter on exact, less/greater than equal and range.<br/>Supports slice syntax:<br/><br/>`date=1970-01-01` (exact)<br/>`date=:1971-01-01` (less than equal)<br/>`date=1970-01-01:` (greater than equal)<br/>`date=1970-01-01:1971-01-01` (range)<br/> |
| `publish_status` | `query` | no | `array` items: `string` | Filter on publish_status exact match<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `release_id` | `query` | no | `array` items: `number` | Filter on exact release ID match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `release_name` | `query` | no | `array` items: `string` | Filter on case-insensitive release name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `sale_type` | `query` | no | `array` items: `string` | Filter on case-insensitive sale type exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `sub_genre_id` | `query` | no | `array` items: `number` | Filter on case-insensitive sub-genre exact match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `supplier_id` | `query` | no | `array` items: `number` | Filter on case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `supplier_name` | `query` | no | `array` items: `string` | Filter on case-insensitive name containment.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `track_number` | `query` | no | `array` items: `number` | Filter on exact track_number match.<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `type` | `query` | no | `array` items: `string` | Filter on track type. Either Release, Album or Mix<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `type_id` | `query` | no | `array` items: `number` | Filter on track release type id<br/>Supports `OR` lookup:<br/><br/>`param=value1,value2`<br/> |
| `was_ever_exclusive` | `query` | no | `string` enum: `false`, `true` | Filter on was_ever_exclusive boolean match.<br/><br/>* `false` - False<br/>* `true` - True |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PaginatedPlaylistTrackList` |  |

### POST /v4/my/playlists/{myplaylists_pk}/tracks/
**operationId:** `my_playlists_tracks_create`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `myplaylists_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Request Body**
- required: yes
  - `application/json`: `PlaylistTrackCreate`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 201 | `application/json` | `PlaylistTrackCreate` |  |

### DELETE /v4/my/playlists/{myplaylists_pk}/tracks/bulk/
**operationId:** `my_playlists_tracks_bulk_destroy`

Request Body:&lt;br&gt;
Item IDs to delete. The body should include:&lt;br&gt;
&lt;strong&gt;item_ids&lt;/strong&gt; (required): List of playlist tracks to delete from the playlist.
(example: {"item_ids": [&lt;id&gt;, &lt;id&gt;, ...]}
  &lt;br&gt;Example: {"item_ids": [1, 2, 3]}

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `myplaylists_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Playlist_metadata_response` | 200 |

### PATCH /v4/my/playlists/{myplaylists_pk}/tracks/bulk/
**operationId:** `my_playlists_tracks_bulk_partial_update`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `myplaylists_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Request Body**
- required: no
  - `PATCH`: `PatchedTracks_to_update`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Playlist_metadata_response` | 200 |

### POST /v4/my/playlists/{myplaylists_pk}/tracks/bulk/
**operationId:** `my_playlists_tracks_bulk_create`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `myplaylists_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Request Body**
- required: yes
  - `POST`: `Add_list_of_tracks_to_playlist`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `Post_response` | 200 |

### GET /v4/my/playlists/{myplaylists_pk}/tracks/facets/
**operationId:** `my_playlists_tracks_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `myplaylists_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PlaylistTrack` |  |

### GET /v4/my/playlists/{myplaylists_pk}/tracks/ids/
**operationId:** `my_playlists_tracks_ids_retrieve`
Return a list of `PlaylistTrack` IDs for the given playlist.

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `myplaylists_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PlaylistTrackId` |  |

### DELETE /v4/my/playlists/{myplaylists_pk}/tracks/{id}/
**operationId:** `my_playlists_tracks_destroy`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |
| `myplaylists_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 204 | — | — | No response body |

### PATCH /v4/my/playlists/{myplaylists_pk}/tracks/{id}/
**operationId:** `my_playlists_tracks_partial_update`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |
| `myplaylists_pk` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Request Body**
- required: no
  - `application/json`: `PatchedPlaylistTrackUpdate`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | `application/json` | `PlaylistTrackUpdate` |  |

### GET /v4/my/streaming-quality/
**operationId:** `my_streaming_quality_retrieve`

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | — | — | No response body |

### GET /v4/my/streaming-quality/facets/
**operationId:** `my_streaming_quality_facets_retrieve`
Return all filter facets for this endpoint, including help text.

If no filters are present, an empty response is returned.

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | — | — | No response body |

### PATCH /v4/my/streaming-quality/{id}/
**operationId:** `my_streaming_quality_partial_update`

**Parameters**
| Name | In | Required | Schema | Description |
|---|---|---:|---|---|
| `id` | `path` | yes | `string` pattern: `^[0-9]+$` |  |

**Security:** `basicAuth`, `cookieAuth`

**Responses**
| Status | Content-Type | Schema | Description |
|---:|---|---|---|
| 200 | — | — | No response body |


## Schemas (index)
- `Add_list_of_tracks_to_playlist`
- `Artist`
- `ArtistDetail`
- `ArtistList`
- `ArtistNested`
- `ArtistType`
- `ArtistTypeDetail`
- `ArtistTypeList`
- `AudioFormatNested`
- `Chart`
- `ChartDetail`
- `ChartGenreOverview`
- `ChartList`
- `ChartTrack`
- `ChordTypeList`
- `CommercialModelType`
- `CommercialModelTypeList`
- `CuratedPlaylist`
- `CurrentStatusList`
- `EncodeStatusEnum`
- `ExclusivePeriodNested`
- `Genre`
- `GenreCategoryList`
- `GenreDetail`
- `GenreList`
- `GenreNested`
- `GenreSubscribe`
- `ImageList`
- `Item`
- `KeyList`
- `Label`
- `LabelCSVExport`
- `LabelDetail`
- `LabelList`
- `LabelManagerNested`
- `LabelNested`
- `MyBeatportList`
- `MyChartCreateUpdate`
- `MyChartTrackCreateUpdate`
- `OK`
- `PaginatedArtistListList`
- `PaginatedArtistTypeListList`
- `PaginatedChartListList`
- `PaginatedChartTrackList`
- `PaginatedCommercialModelTypeListList`
- `PaginatedCuratedPlaylistList`
- `PaginatedGenreListList`
- `PaginatedLabelListList`
- `PaginatedMyBeatportListList`
- `PaginatedPersonAccountList`
- `PaginatedPlaylistProxyList`
- `PaginatedPlaylistTrackList`
- `PaginatedReleaseListList`
- `PaginatedSubGenreListList`
- `PaginatedTrackDownloadListList`
- `PaginatedTrackListList`
- `PatchedMyChartCreateUpdate`
- `PatchedMyChartTrackCreateUpdate`
- `PatchedPersonAccountUpdate`
- `PatchedPlaylistBulkUpdate`
- `PatchedPlaylistTrackUpdate`
- `PatchedRequest_body`
- `PatchedTracks_to_update`
- `PersonAccount`
- `PersonAccountUpdate`
- `PersonDjProfileNested`
- `PersonPreference`
- `PersonPreferenceUpdate`
- `Playlist`
- `PlaylistBulkUpdate`
- `PlaylistProxy`
- `PlaylistReorder`
- `PlaylistTrack`
- `PlaylistTrackCreate`
- `PlaylistTrackId`
- `PlaylistTrackUpdate`
- `PlaylistType`
- `Playlist_metadata_response`
- `Post_response`
- `PublishStatusEnum`
- `Release`
- `ReleaseDetail`
- `ReleaseList`
- `ReleaseTrackId`
- `ReleaseTypesDetail`
- `Request_body`
- `SaleTypeList`
- `SourceTypeList`
- `SubGenre`
- `SubGenreDetail`
- `SubGenreList`
- `SubGenreNested`
- `SupplierNested`
- `TempAccount`
- `Track`
- `TrackArtist`
- `TrackDetail`
- `TrackDownloadList`
- `TrackFreeDownload`
- `TrackList`
- `Whether_the_playlist_is_a_user_or_curated_playlist.`

---
_Integrity SHA-256:_ `ad5d7ea3c57c78f05a2648f526708f135629ab0167e7e7d499732bd931b7c57c`
