import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';

export type DeleteCheckinDeleteResponse204 = FromSchema<
	(typeof schemas.DeleteCheckinDelete.response)['204']
>;
export type DeleteCommentsDeleteMetadataParam = FromSchema<
	typeof schemas.DeleteCommentsDelete.metadata
>;
export type DeleteCommentsDeleteResponse204 = FromSchema<
	(typeof schemas.DeleteCommentsDelete.response)['204']
>;
export type DeleteCommentsReactionsRemoveMetadataParam = FromSchema<
	typeof schemas.DeleteCommentsReactionsRemove.metadata
>;
export type DeleteCommentsReactionsRemoveResponse204 = FromSchema<
	(typeof schemas.DeleteCommentsReactionsRemove.response)['204']
>;
export type DeleteCommentsUnlikeMetadataParam = FromSchema<
	typeof schemas.DeleteCommentsUnlike.metadata
>;
export type DeleteCommentsUnlikeResponse204 = FromSchema<
	(typeof schemas.DeleteCommentsUnlike.response)['204']
>;
export type DeleteListsUnlikeMetadataParam = FromSchema<typeof schemas.DeleteListsUnlike.metadata>;
export type DeleteListsUnlikeResponse204 = FromSchema<
	(typeof schemas.DeleteListsUnlike.response)['204']
>;
export type DeleteNotesDeleteMetadataParam = FromSchema<typeof schemas.DeleteNotesDelete.metadata>;
export type DeleteNotesDeleteResponse204 = FromSchema<
	(typeof schemas.DeleteNotesDelete.response)['204']
>;
export type DeleteRecommendationsMoviesHideMetadataParam = FromSchema<
	typeof schemas.DeleteRecommendationsMoviesHide.metadata
>;
export type DeleteRecommendationsMoviesHideResponse204 = FromSchema<
	(typeof schemas.DeleteRecommendationsMoviesHide.response)['204']
>;
export type DeleteRecommendationsShowsHideMetadataParam = FromSchema<
	typeof schemas.DeleteRecommendationsShowsHide.metadata
>;
export type DeleteRecommendationsShowsHideResponse204 = FromSchema<
	(typeof schemas.DeleteRecommendationsShowsHide.response)['204']
>;
export type DeleteShowsProgressUndoResetMetadataParam = FromSchema<
	typeof schemas.DeleteShowsProgressUndoReset.metadata
>;
export type DeleteShowsProgressUndoResetResponse204 = FromSchema<
	(typeof schemas.DeleteShowsProgressUndoReset.response)['204']
>;
export type DeleteSyncProgressDropMovieMetadataParam = FromSchema<
	typeof schemas.DeleteSyncProgressDropMovie.metadata
>;
export type DeleteSyncProgressDropMovieResponse204 = FromSchema<
	(typeof schemas.DeleteSyncProgressDropMovie.response)['204']
>;
export type DeleteUsersFiltersDeleteMetadataParam = FromSchema<
	typeof schemas.DeleteUsersFiltersDelete.metadata
>;
export type DeleteUsersFiltersDeleteResponse204 = FromSchema<
	(typeof schemas.DeleteUsersFiltersDelete.response)['204']
>;
export type DeleteUsersFiltersDeleteResponse404 = FromSchema<
	(typeof schemas.DeleteUsersFiltersDelete.response)['404']
>;
export type DeleteUsersListsListDeleteMetadataParam = FromSchema<
	typeof schemas.DeleteUsersListsListDelete.metadata
>;
export type DeleteUsersListsListDeleteResponse204 = FromSchema<
	(typeof schemas.DeleteUsersListsListDelete.response)['204']
>;
export type DeleteUsersListsListDeleteResponse403 = FromSchema<
	(typeof schemas.DeleteUsersListsListDelete.response)['403']
>;
export type DeleteUsersListsListUnlikeMetadataParam = FromSchema<
	typeof schemas.DeleteUsersListsListUnlike.metadata
>;
export type DeleteUsersListsListUnlikeResponse204 = FromSchema<
	(typeof schemas.DeleteUsersListsListUnlike.response)['204']
>;
export type DeleteUsersPlexDisconnectResponse204 = FromSchema<
	(typeof schemas.DeleteUsersPlexDisconnect.response)['204']
>;
export type DeleteUsersRequestsDenyMetadataParam = FromSchema<
	typeof schemas.DeleteUsersRequestsDeny.metadata
>;
export type DeleteUsersRequestsDenyResponse204 = FromSchema<
	(typeof schemas.DeleteUsersRequestsDeny.response)['204']
>;
export type DeleteUsersRequestsDenyResponse404 = FromSchema<
	(typeof schemas.DeleteUsersRequestsDeny.response)['404']
>;
export type DeleteUsersSyncsUndoMetadataParam = FromSchema<
	typeof schemas.DeleteUsersSyncsUndo.metadata
>;
export type DeleteUsersSyncsUndoResponse204 = FromSchema<
	(typeof schemas.DeleteUsersSyncsUndo.response)['204']
>;
export type DeleteUsersSyncsUndoResponse404 = FromSchema<
	(typeof schemas.DeleteUsersSyncsUndo.response)['404']
>;
export type DeleteUsersUnblockMetadataParam = FromSchema<
	typeof schemas.DeleteUsersUnblock.metadata
>;
export type DeleteUsersUnblockResponse204 = FromSchema<
	(typeof schemas.DeleteUsersUnblock.response)['204']
>;
export type DeleteUsersUnfollowMetadataParam = FromSchema<
	typeof schemas.DeleteUsersUnfollow.metadata
>;
export type DeleteUsersUnfollowResponse204 = FromSchema<
	(typeof schemas.DeleteUsersUnfollow.response)['204']
>;
export type DeleteYounifyDisconnectMetadataParam = FromSchema<
	typeof schemas.DeleteYounifyDisconnect.metadata
>;
export type DeleteYounifyDisconnectResponse204 = FromSchema<
	(typeof schemas.DeleteYounifyDisconnect.response)['204']
>;
export type GetCalendarsDvdReleasesMetadataParam = FromSchema<
	typeof schemas.GetCalendarsDvdReleases.metadata
>;
export type GetCalendarsDvdReleasesResponse200 = FromSchema<
	(typeof schemas.GetCalendarsDvdReleases.response)['200']
>;
export type GetCalendarsFinalesMetadataParam = FromSchema<
	typeof schemas.GetCalendarsFinales.metadata
>;
export type GetCalendarsFinalesResponse200 = FromSchema<
	(typeof schemas.GetCalendarsFinales.response)['200']
>;
export type GetCalendarsMoviesMetadataParam = FromSchema<
	typeof schemas.GetCalendarsMovies.metadata
>;
export type GetCalendarsMoviesResponse200 = FromSchema<
	(typeof schemas.GetCalendarsMovies.response)['200']
>;
export type GetCalendarsNewShowsMetadataParam = FromSchema<
	typeof schemas.GetCalendarsNewShows.metadata
>;
export type GetCalendarsNewShowsResponse200 = FromSchema<
	(typeof schemas.GetCalendarsNewShows.response)['200']
>;
export type GetCalendarsSeasonPremieresMetadataParam = FromSchema<
	typeof schemas.GetCalendarsSeasonPremieres.metadata
>;
export type GetCalendarsSeasonPremieresResponse200 = FromSchema<
	(typeof schemas.GetCalendarsSeasonPremieres.response)['200']
>;
export type GetCalendarsShowsMetadataParam = FromSchema<typeof schemas.GetCalendarsShows.metadata>;
export type GetCalendarsShowsResponse200 = FromSchema<
	(typeof schemas.GetCalendarsShows.response)['200']
>;
export type GetCalendarsStreamingMetadataParam = FromSchema<
	typeof schemas.GetCalendarsStreaming.metadata
>;
export type GetCalendarsStreamingResponse200 = FromSchema<
	(typeof schemas.GetCalendarsStreaming.response)['200']
>;
export type GetCertificationsListMetadataParam = FromSchema<
	typeof schemas.GetCertificationsList.metadata
>;
export type GetCertificationsListResponse200 = FromSchema<
	(typeof schemas.GetCertificationsList.response)['200']
>;
export type GetCertificationsMoviesResponse200 = FromSchema<
	(typeof schemas.GetCertificationsMovies.response)['200']
>;
export type GetCertificationsShowsResponse200 = FromSchema<
	(typeof schemas.GetCertificationsShows.response)['200']
>;
export type GetCommentsItemMetadataParam = FromSchema<typeof schemas.GetCommentsItem.metadata>;
export type GetCommentsItemResponse200 = FromSchema<
	(typeof schemas.GetCommentsItem.response)['200']
>;
export type GetCommentsLikesMetadataParam = FromSchema<typeof schemas.GetCommentsLikes.metadata>;
export type GetCommentsLikesResponse200 = FromSchema<
	(typeof schemas.GetCommentsLikes.response)['200']
>;
export type GetCommentsReactionsAllMetadataParam = FromSchema<
	typeof schemas.GetCommentsReactionsAll.metadata
>;
export type GetCommentsReactionsAllResponse200 = FromSchema<
	(typeof schemas.GetCommentsReactionsAll.response)['200']
>;
export type GetCommentsReactionsSummaryMetadataParam = FromSchema<
	typeof schemas.GetCommentsReactionsSummary.metadata
>;
export type GetCommentsReactionsSummaryResponse200 = FromSchema<
	(typeof schemas.GetCommentsReactionsSummary.response)['200']
>;
export type GetCommentsRecentMetadataParam = FromSchema<typeof schemas.GetCommentsRecent.metadata>;
export type GetCommentsRecentResponse200 = FromSchema<
	(typeof schemas.GetCommentsRecent.response)['200']
>;
export type GetCommentsRepliesMetadataParam = FromSchema<
	typeof schemas.GetCommentsReplies.metadata
>;
export type GetCommentsRepliesResponse200 = FromSchema<
	(typeof schemas.GetCommentsReplies.response)['200']
>;
export type GetCommentsSummaryMetadataParam = FromSchema<
	typeof schemas.GetCommentsSummary.metadata
>;
export type GetCommentsSummaryResponse200 = FromSchema<
	(typeof schemas.GetCommentsSummary.response)['200']
>;
export type GetCommentsTrendingMetadataParam = FromSchema<
	typeof schemas.GetCommentsTrending.metadata
>;
export type GetCommentsTrendingResponse200 = FromSchema<
	(typeof schemas.GetCommentsTrending.response)['200']
>;
export type GetCommentsUpdatesMetadataParam = FromSchema<
	typeof schemas.GetCommentsUpdates.metadata
>;
export type GetCommentsUpdatesResponse200 = FromSchema<
	(typeof schemas.GetCommentsUpdates.response)['200']
>;
export type GetCountriesListMetadataParam = FromSchema<typeof schemas.GetCountriesList.metadata>;
export type GetCountriesListResponse200 = FromSchema<
	(typeof schemas.GetCountriesList.response)['200']
>;
export type GetEpisodesWatchnowMetadataParam = FromSchema<
	typeof schemas.GetEpisodesWatchnow.metadata
>;
export type GetEpisodesWatchnowResponse200 = FromSchema<
	(typeof schemas.GetEpisodesWatchnow.response)['200']
>;
export type GetGenresListMetadataParam = FromSchema<typeof schemas.GetGenresList.metadata>;
export type GetGenresListResponse200 = FromSchema<(typeof schemas.GetGenresList.response)['200']>;
export type GetLanguagesListMetadataParam = FromSchema<typeof schemas.GetLanguagesList.metadata>;
export type GetLanguagesListResponse200 = FromSchema<
	(typeof schemas.GetLanguagesList.response)['200']
>;
export type GetListsCommentsMetadataParam = FromSchema<typeof schemas.GetListsComments.metadata>;
export type GetListsCommentsResponse200 = FromSchema<
	(typeof schemas.GetListsComments.response)['200']
>;
export type GetListsItemsAllMetadataParam = FromSchema<typeof schemas.GetListsItemsAll.metadata>;
export type GetListsItemsAllResponse200 = FromSchema<
	(typeof schemas.GetListsItemsAll.response)['200']
>;
export type GetListsItemsMediaMetadataParam = FromSchema<
	typeof schemas.GetListsItemsMedia.metadata
>;
export type GetListsItemsMediaResponse200 = FromSchema<
	(typeof schemas.GetListsItemsMedia.response)['200']
>;
export type GetListsItemsMovieMetadataParam = FromSchema<
	typeof schemas.GetListsItemsMovie.metadata
>;
export type GetListsItemsMovieResponse200 = FromSchema<
	(typeof schemas.GetListsItemsMovie.response)['200']
>;
export type GetListsItemsShowMetadataParam = FromSchema<typeof schemas.GetListsItemsShow.metadata>;
export type GetListsItemsShowResponse200 = FromSchema<
	(typeof schemas.GetListsItemsShow.response)['200']
>;
export type GetListsItemsTypedSortedMetadataParam = FromSchema<
	typeof schemas.GetListsItemsTypedSorted.metadata
>;
export type GetListsItemsTypedSortedResponse200 = FromSchema<
	(typeof schemas.GetListsItemsTypedSorted.response)['200']
>;
export type GetListsLikesMetadataParam = FromSchema<typeof schemas.GetListsLikes.metadata>;
export type GetListsLikesResponse200 = FromSchema<(typeof schemas.GetListsLikes.response)['200']>;
export type GetListsPopularByTypeMetadataParam = FromSchema<
	typeof schemas.GetListsPopularByType.metadata
>;
export type GetListsPopularByTypeResponse200 = FromSchema<
	(typeof schemas.GetListsPopularByType.response)['200']
>;
export type GetListsPopularMetadataParam = FromSchema<typeof schemas.GetListsPopular.metadata>;
export type GetListsPopularResponse200 = FromSchema<
	(typeof schemas.GetListsPopular.response)['200']
>;
export type GetListsSummaryMetadataParam = FromSchema<typeof schemas.GetListsSummary.metadata>;
export type GetListsSummaryResponse200 = FromSchema<
	(typeof schemas.GetListsSummary.response)['200']
>;
export type GetListsTrendingByTypeMetadataParam = FromSchema<
	typeof schemas.GetListsTrendingByType.metadata
>;
export type GetListsTrendingByTypeResponse200 = FromSchema<
	(typeof schemas.GetListsTrendingByType.response)['200']
>;
export type GetListsTrendingMetadataParam = FromSchema<typeof schemas.GetListsTrending.metadata>;
export type GetListsTrendingResponse200 = FromSchema<
	(typeof schemas.GetListsTrending.response)['200']
>;
export type GetMediaAnticipatedMetadataParam = FromSchema<
	typeof schemas.GetMediaAnticipated.metadata
>;
export type GetMediaAnticipatedResponse200 = FromSchema<
	(typeof schemas.GetMediaAnticipated.response)['200']
>;
export type GetMediaPopularMetadataParam = FromSchema<typeof schemas.GetMediaPopular.metadata>;
export type GetMediaPopularResponse200 = FromSchema<
	(typeof schemas.GetMediaPopular.response)['200']
>;
export type GetMediaTrendingMetadataParam = FromSchema<typeof schemas.GetMediaTrending.metadata>;
export type GetMediaTrendingResponse200 = FromSchema<
	(typeof schemas.GetMediaTrending.response)['200']
>;
export type GetMoviesAliasesMetadataParam = FromSchema<typeof schemas.GetMoviesAliases.metadata>;
export type GetMoviesAliasesResponse200 = FromSchema<
	(typeof schemas.GetMoviesAliases.response)['200']
>;
export type GetMoviesAnticipatedMetadataParam = FromSchema<
	typeof schemas.GetMoviesAnticipated.metadata
>;
export type GetMoviesAnticipatedResponse200 = FromSchema<
	(typeof schemas.GetMoviesAnticipated.response)['200']
>;
export type GetMoviesBoxofficeMetadataParam = FromSchema<
	typeof schemas.GetMoviesBoxoffice.metadata
>;
export type GetMoviesBoxofficeResponse200 = FromSchema<
	(typeof schemas.GetMoviesBoxoffice.response)['200']
>;
export type GetMoviesCollectedMetadataParam = FromSchema<
	typeof schemas.GetMoviesCollected.metadata
>;
export type GetMoviesCollectedResponse200 = FromSchema<
	(typeof schemas.GetMoviesCollected.response)['200']
>;
export type GetMoviesCommentsMetadataParam = FromSchema<typeof schemas.GetMoviesComments.metadata>;
export type GetMoviesCommentsResponse200 = FromSchema<
	(typeof schemas.GetMoviesComments.response)['200']
>;
export type GetMoviesFavoritedMetadataParam = FromSchema<
	typeof schemas.GetMoviesFavorited.metadata
>;
export type GetMoviesFavoritedResponse200 = FromSchema<
	(typeof schemas.GetMoviesFavorited.response)['200']
>;
export type GetMoviesHotMetadataParam = FromSchema<typeof schemas.GetMoviesHot.metadata>;
export type GetMoviesHotResponse200 = FromSchema<(typeof schemas.GetMoviesHot.response)['200']>;
export type GetMoviesJustwatchLinkMetadataParam = FromSchema<
	typeof schemas.GetMoviesJustwatchLink.metadata
>;
export type GetMoviesJustwatchLinkResponse200 = FromSchema<
	(typeof schemas.GetMoviesJustwatchLink.response)['200']
>;
export type GetMoviesListsMetadataParam = FromSchema<typeof schemas.GetMoviesLists.metadata>;
export type GetMoviesListsResponse200 = FromSchema<(typeof schemas.GetMoviesLists.response)['200']>;
export type GetMoviesPeopleMetadataParam = FromSchema<typeof schemas.GetMoviesPeople.metadata>;
export type GetMoviesPeopleResponse200 = FromSchema<
	(typeof schemas.GetMoviesPeople.response)['200']
>;
export type GetMoviesPlayedMetadataParam = FromSchema<typeof schemas.GetMoviesPlayed.metadata>;
export type GetMoviesPlayedResponse200 = FromSchema<
	(typeof schemas.GetMoviesPlayed.response)['200']
>;
export type GetMoviesPopularMetadataParam = FromSchema<typeof schemas.GetMoviesPopular.metadata>;
export type GetMoviesPopularResponse200 = FromSchema<
	(typeof schemas.GetMoviesPopular.response)['200']
>;
export type GetMoviesRatingsMetadataParam = FromSchema<typeof schemas.GetMoviesRatings.metadata>;
export type GetMoviesRatingsResponse200 = FromSchema<
	(typeof schemas.GetMoviesRatings.response)['200']
>;
export type GetMoviesRelatedMetadataParam = FromSchema<typeof schemas.GetMoviesRelated.metadata>;
export type GetMoviesRelatedResponse200 = FromSchema<
	(typeof schemas.GetMoviesRelated.response)['200']
>;
export type GetMoviesReleasesMetadataParam = FromSchema<typeof schemas.GetMoviesReleases.metadata>;
export type GetMoviesReleasesResponse200 = FromSchema<
	(typeof schemas.GetMoviesReleases.response)['200']
>;
export type GetMoviesSentimentsMetadataParam = FromSchema<
	typeof schemas.GetMoviesSentiments.metadata
>;
export type GetMoviesSentimentsResponse200 = FromSchema<
	(typeof schemas.GetMoviesSentiments.response)['200']
>;
export type GetMoviesStatsMetadataParam = FromSchema<typeof schemas.GetMoviesStats.metadata>;
export type GetMoviesStatsResponse200 = FromSchema<(typeof schemas.GetMoviesStats.response)['200']>;
export type GetMoviesStreamingMetadataParam = FromSchema<
	typeof schemas.GetMoviesStreaming.metadata
>;
export type GetMoviesStreamingResponse200 = FromSchema<
	(typeof schemas.GetMoviesStreaming.response)['200']
>;
export type GetMoviesStudiosMetadataParam = FromSchema<typeof schemas.GetMoviesStudios.metadata>;
export type GetMoviesStudiosResponse200 = FromSchema<
	(typeof schemas.GetMoviesStudios.response)['200']
>;
export type GetMoviesSummaryMetadataParam = FromSchema<typeof schemas.GetMoviesSummary.metadata>;
export type GetMoviesSummaryResponse200 = FromSchema<
	(typeof schemas.GetMoviesSummary.response)['200']
>;
export type GetMoviesTranslationsMetadataParam = FromSchema<
	typeof schemas.GetMoviesTranslations.metadata
>;
export type GetMoviesTranslationsResponse200 = FromSchema<
	(typeof schemas.GetMoviesTranslations.response)['200']
>;
export type GetMoviesTrendingMetadataParam = FromSchema<typeof schemas.GetMoviesTrending.metadata>;
export type GetMoviesTrendingResponse200 = FromSchema<
	(typeof schemas.GetMoviesTrending.response)['200']
>;
export type GetMoviesUpdatedIdsMetadataParam = FromSchema<
	typeof schemas.GetMoviesUpdatedIds.metadata
>;
export type GetMoviesUpdatedIdsResponse200 = FromSchema<
	(typeof schemas.GetMoviesUpdatedIds.response)['200']
>;
export type GetMoviesUpdatesMetadataParam = FromSchema<typeof schemas.GetMoviesUpdates.metadata>;
export type GetMoviesUpdatesResponse200 = FromSchema<
	(typeof schemas.GetMoviesUpdates.response)['200']
>;
export type GetMoviesVideosMetadataParam = FromSchema<typeof schemas.GetMoviesVideos.metadata>;
export type GetMoviesVideosResponse200 = FromSchema<
	(typeof schemas.GetMoviesVideos.response)['200']
>;
export type GetMoviesWatchedMetadataParam = FromSchema<typeof schemas.GetMoviesWatched.metadata>;
export type GetMoviesWatchedResponse200 = FromSchema<
	(typeof schemas.GetMoviesWatched.response)['200']
>;
export type GetMoviesWatchingMetadataParam = FromSchema<typeof schemas.GetMoviesWatching.metadata>;
export type GetMoviesWatchingResponse200 = FromSchema<
	(typeof schemas.GetMoviesWatching.response)['200']
>;
export type GetMoviesWatchnowMetadataParam = FromSchema<typeof schemas.GetMoviesWatchnow.metadata>;
export type GetMoviesWatchnowResponse200 = FromSchema<
	(typeof schemas.GetMoviesWatchnow.response)['200']
>;
export type GetNetworksListResponse200 = FromSchema<
	(typeof schemas.GetNetworksList.response)['200']
>;
export type GetNotesItemMetadataParam = FromSchema<typeof schemas.GetNotesItem.metadata>;
export type GetNotesItemResponse200 = FromSchema<(typeof schemas.GetNotesItem.response)['200']>;
export type GetNotesSummaryMetadataParam = FromSchema<typeof schemas.GetNotesSummary.metadata>;
export type GetNotesSummaryResponse200 = FromSchema<
	(typeof schemas.GetNotesSummary.response)['200']
>;
export type GetOauthAuthorizeMetadataParam = FromSchema<typeof schemas.GetOauthAuthorize.metadata>;
export type GetOauthAuthorizeResponse200 = FromSchema<
	(typeof schemas.GetOauthAuthorize.response)['200']
>;
export type GetPeopleListsMetadataParam = FromSchema<typeof schemas.GetPeopleLists.metadata>;
export type GetPeopleListsResponse200 = FromSchema<(typeof schemas.GetPeopleLists.response)['200']>;
export type GetPeopleMoviesMetadataParam = FromSchema<typeof schemas.GetPeopleMovies.metadata>;
export type GetPeopleMoviesResponse200 = FromSchema<
	(typeof schemas.GetPeopleMovies.response)['200']
>;
export type GetPeopleShowsMetadataParam = FromSchema<typeof schemas.GetPeopleShows.metadata>;
export type GetPeopleShowsResponse200 = FromSchema<(typeof schemas.GetPeopleShows.response)['200']>;
export type GetPeopleSummaryMetadataParam = FromSchema<typeof schemas.GetPeopleSummary.metadata>;
export type GetPeopleSummaryResponse200 = FromSchema<
	(typeof schemas.GetPeopleSummary.response)['200']
>;
export type GetPeopleUpdatedIdsMetadataParam = FromSchema<
	typeof schemas.GetPeopleUpdatedIds.metadata
>;
export type GetPeopleUpdatedIdsResponse200 = FromSchema<
	(typeof schemas.GetPeopleUpdatedIds.response)['200']
>;
export type GetPeopleUpdatesMetadataParam = FromSchema<typeof schemas.GetPeopleUpdates.metadata>;
export type GetPeopleUpdatesResponse200 = FromSchema<
	(typeof schemas.GetPeopleUpdates.response)['200']
>;
export type GetRecommendationsMoviesRecommendMetadataParam = FromSchema<
	typeof schemas.GetRecommendationsMoviesRecommend.metadata
>;
export type GetRecommendationsMoviesRecommendResponse200 = FromSchema<
	(typeof schemas.GetRecommendationsMoviesRecommend.response)['200']
>;
export type GetRecommendationsShowsRecommendMetadataParam = FromSchema<
	typeof schemas.GetRecommendationsShowsRecommend.metadata
>;
export type GetRecommendationsShowsRecommendResponse200 = FromSchema<
	(typeof schemas.GetRecommendationsShowsRecommend.response)['200']
>;
export type GetSearchExactMetadataParam = FromSchema<typeof schemas.GetSearchExact.metadata>;
export type GetSearchExactResponse200 = FromSchema<(typeof schemas.GetSearchExact.response)['200']>;
export type GetSearchLookupMetadataParam = FromSchema<typeof schemas.GetSearchLookup.metadata>;
export type GetSearchLookupResponse200 = FromSchema<
	(typeof schemas.GetSearchLookup.response)['200']
>;
export type GetSearchQueryMetadataParam = FromSchema<typeof schemas.GetSearchQuery.metadata>;
export type GetSearchQueryResponse200 = FromSchema<(typeof schemas.GetSearchQuery.response)['200']>;
export type GetSearchTrendingMetadataParam = FromSchema<typeof schemas.GetSearchTrending.metadata>;
export type GetSearchTrendingResponse200 = FromSchema<
	(typeof schemas.GetSearchTrending.response)['200']
>;
export type GetShowsAliasesMetadataParam = FromSchema<typeof schemas.GetShowsAliases.metadata>;
export type GetShowsAliasesResponse200 = FromSchema<
	(typeof schemas.GetShowsAliases.response)['200']
>;
export type GetShowsAnticipatedMetadataParam = FromSchema<
	typeof schemas.GetShowsAnticipated.metadata
>;
export type GetShowsAnticipatedResponse200 = FromSchema<
	(typeof schemas.GetShowsAnticipated.response)['200']
>;
export type GetShowsCertificationsMetadataParam = FromSchema<
	typeof schemas.GetShowsCertifications.metadata
>;
export type GetShowsCertificationsResponse200 = FromSchema<
	(typeof schemas.GetShowsCertifications.response)['200']
>;
export type GetShowsCollectedMetadataParam = FromSchema<typeof schemas.GetShowsCollected.metadata>;
export type GetShowsCollectedResponse200 = FromSchema<
	(typeof schemas.GetShowsCollected.response)['200']
>;
export type GetShowsCommentsMetadataParam = FromSchema<typeof schemas.GetShowsComments.metadata>;
export type GetShowsCommentsResponse200 = FromSchema<
	(typeof schemas.GetShowsComments.response)['200']
>;
export type GetShowsEpisodeCommentsMetadataParam = FromSchema<
	typeof schemas.GetShowsEpisodeComments.metadata
>;
export type GetShowsEpisodeCommentsResponse200 = FromSchema<
	(typeof schemas.GetShowsEpisodeComments.response)['200']
>;
export type GetShowsEpisodeListsMetadataParam = FromSchema<
	typeof schemas.GetShowsEpisodeLists.metadata
>;
export type GetShowsEpisodeListsResponse200 = FromSchema<
	(typeof schemas.GetShowsEpisodeLists.response)['200']
>;
export type GetShowsEpisodePeopleMetadataParam = FromSchema<
	typeof schemas.GetShowsEpisodePeople.metadata
>;
export type GetShowsEpisodePeopleResponse200 = FromSchema<
	(typeof schemas.GetShowsEpisodePeople.response)['200']
>;
export type GetShowsEpisodeRatingsMetadataParam = FromSchema<
	typeof schemas.GetShowsEpisodeRatings.metadata
>;
export type GetShowsEpisodeRatingsResponse200 = FromSchema<
	(typeof schemas.GetShowsEpisodeRatings.response)['200']
>;
export type GetShowsEpisodeStatsMetadataParam = FromSchema<
	typeof schemas.GetShowsEpisodeStats.metadata
>;
export type GetShowsEpisodeStatsResponse200 = FromSchema<
	(typeof schemas.GetShowsEpisodeStats.response)['200']
>;
export type GetShowsEpisodeSummaryMetadataParam = FromSchema<
	typeof schemas.GetShowsEpisodeSummary.metadata
>;
export type GetShowsEpisodeSummaryResponse200 = FromSchema<
	(typeof schemas.GetShowsEpisodeSummary.response)['200']
>;
export type GetShowsEpisodeTranslationsMetadataParam = FromSchema<
	typeof schemas.GetShowsEpisodeTranslations.metadata
>;
export type GetShowsEpisodeTranslationsResponse200 = FromSchema<
	(typeof schemas.GetShowsEpisodeTranslations.response)['200']
>;
export type GetShowsEpisodeVideosMetadataParam = FromSchema<
	typeof schemas.GetShowsEpisodeVideos.metadata
>;
export type GetShowsEpisodeVideosResponse200 = FromSchema<
	(typeof schemas.GetShowsEpisodeVideos.response)['200']
>;
export type GetShowsEpisodeWatchingMetadataParam = FromSchema<
	typeof schemas.GetShowsEpisodeWatching.metadata
>;
export type GetShowsEpisodeWatchingResponse200 = FromSchema<
	(typeof schemas.GetShowsEpisodeWatching.response)['200']
>;
export type GetShowsEpisodeWatchnowMetadataParam = FromSchema<
	typeof schemas.GetShowsEpisodeWatchnow.metadata
>;
export type GetShowsEpisodeWatchnowResponse200 = FromSchema<
	(typeof schemas.GetShowsEpisodeWatchnow.response)['200']
>;
export type GetShowsFavoritedMetadataParam = FromSchema<typeof schemas.GetShowsFavorited.metadata>;
export type GetShowsFavoritedResponse200 = FromSchema<
	(typeof schemas.GetShowsFavorited.response)['200']
>;
export type GetShowsHotMetadataParam = FromSchema<typeof schemas.GetShowsHot.metadata>;
export type GetShowsHotResponse200 = FromSchema<(typeof schemas.GetShowsHot.response)['200']>;
export type GetShowsJustwatchLinkMetadataParam = FromSchema<
	typeof schemas.GetShowsJustwatchLink.metadata
>;
export type GetShowsJustwatchLinkResponse200 = FromSchema<
	(typeof schemas.GetShowsJustwatchLink.response)['200']
>;
export type GetShowsLastEpisodeMetadataParam = FromSchema<
	typeof schemas.GetShowsLastEpisode.metadata
>;
export type GetShowsLastEpisodeResponse200 = FromSchema<
	(typeof schemas.GetShowsLastEpisode.response)['200']
>;
export type GetShowsLastEpisodeResponse204 = FromSchema<
	(typeof schemas.GetShowsLastEpisode.response)['204']
>;
export type GetShowsListsMetadataParam = FromSchema<typeof schemas.GetShowsLists.metadata>;
export type GetShowsListsResponse200 = FromSchema<(typeof schemas.GetShowsLists.response)['200']>;
export type GetShowsNextEpisodeMetadataParam = FromSchema<
	typeof schemas.GetShowsNextEpisode.metadata
>;
export type GetShowsNextEpisodeResponse200 = FromSchema<
	(typeof schemas.GetShowsNextEpisode.response)['200']
>;
export type GetShowsNextEpisodeResponse204 = FromSchema<
	(typeof schemas.GetShowsNextEpisode.response)['204']
>;
export type GetShowsPeopleMetadataParam = FromSchema<typeof schemas.GetShowsPeople.metadata>;
export type GetShowsPeopleResponse200 = FromSchema<(typeof schemas.GetShowsPeople.response)['200']>;
export type GetShowsPlayedMetadataParam = FromSchema<typeof schemas.GetShowsPlayed.metadata>;
export type GetShowsPlayedResponse200 = FromSchema<(typeof schemas.GetShowsPlayed.response)['200']>;
export type GetShowsPopularMetadataParam = FromSchema<typeof schemas.GetShowsPopular.metadata>;
export type GetShowsPopularResponse200 = FromSchema<
	(typeof schemas.GetShowsPopular.response)['200']
>;
export type GetShowsProgressCollectionMetadataParam = FromSchema<
	typeof schemas.GetShowsProgressCollection.metadata
>;
export type GetShowsProgressCollectionResponse200 = FromSchema<
	(typeof schemas.GetShowsProgressCollection.response)['200']
>;
export type GetShowsProgressWatchedMetadataParam = FromSchema<
	typeof schemas.GetShowsProgressWatched.metadata
>;
export type GetShowsProgressWatchedResponse200 = FromSchema<
	(typeof schemas.GetShowsProgressWatched.response)['200']
>;
export type GetShowsRatingsMetadataParam = FromSchema<typeof schemas.GetShowsRatings.metadata>;
export type GetShowsRatingsResponse200 = FromSchema<
	(typeof schemas.GetShowsRatings.response)['200']
>;
export type GetShowsRelatedMetadataParam = FromSchema<typeof schemas.GetShowsRelated.metadata>;
export type GetShowsRelatedResponse200 = FromSchema<
	(typeof schemas.GetShowsRelated.response)['200']
>;
export type GetShowsSeasonCommentsMetadataParam = FromSchema<
	typeof schemas.GetShowsSeasonComments.metadata
>;
export type GetShowsSeasonCommentsResponse200 = FromSchema<
	(typeof schemas.GetShowsSeasonComments.response)['200']
>;
export type GetShowsSeasonEpisodesMetadataParam = FromSchema<
	typeof schemas.GetShowsSeasonEpisodes.metadata
>;
export type GetShowsSeasonEpisodesResponse200 = FromSchema<
	(typeof schemas.GetShowsSeasonEpisodes.response)['200']
>;
export type GetShowsSeasonInfoMetadataParam = FromSchema<
	typeof schemas.GetShowsSeasonInfo.metadata
>;
export type GetShowsSeasonInfoResponse200 = FromSchema<
	(typeof schemas.GetShowsSeasonInfo.response)['200']
>;
export type GetShowsSeasonJustwatchLinkMetadataParam = FromSchema<
	typeof schemas.GetShowsSeasonJustwatchLink.metadata
>;
export type GetShowsSeasonJustwatchLinkResponse200 = FromSchema<
	(typeof schemas.GetShowsSeasonJustwatchLink.response)['200']
>;
export type GetShowsSeasonListsMetadataParam = FromSchema<
	typeof schemas.GetShowsSeasonLists.metadata
>;
export type GetShowsSeasonListsResponse200 = FromSchema<
	(typeof schemas.GetShowsSeasonLists.response)['200']
>;
export type GetShowsSeasonPeopleMetadataParam = FromSchema<
	typeof schemas.GetShowsSeasonPeople.metadata
>;
export type GetShowsSeasonPeopleResponse200 = FromSchema<
	(typeof schemas.GetShowsSeasonPeople.response)['200']
>;
export type GetShowsSeasonRatingsMetadataParam = FromSchema<
	typeof schemas.GetShowsSeasonRatings.metadata
>;
export type GetShowsSeasonRatingsResponse200 = FromSchema<
	(typeof schemas.GetShowsSeasonRatings.response)['200']
>;
export type GetShowsSeasonStatsMetadataParam = FromSchema<
	typeof schemas.GetShowsSeasonStats.metadata
>;
export type GetShowsSeasonStatsResponse200 = FromSchema<
	(typeof schemas.GetShowsSeasonStats.response)['200']
>;
export type GetShowsSeasonTranslationsMetadataParam = FromSchema<
	typeof schemas.GetShowsSeasonTranslations.metadata
>;
export type GetShowsSeasonTranslationsResponse200 = FromSchema<
	(typeof schemas.GetShowsSeasonTranslations.response)['200']
>;
export type GetShowsSeasonVideosMetadataParam = FromSchema<
	typeof schemas.GetShowsSeasonVideos.metadata
>;
export type GetShowsSeasonVideosResponse200 = FromSchema<
	(typeof schemas.GetShowsSeasonVideos.response)['200']
>;
export type GetShowsSeasonWatchingMetadataParam = FromSchema<
	typeof schemas.GetShowsSeasonWatching.metadata
>;
export type GetShowsSeasonWatchingResponse200 = FromSchema<
	(typeof schemas.GetShowsSeasonWatching.response)['200']
>;
export type GetShowsSeasonsMetadataParam = FromSchema<typeof schemas.GetShowsSeasons.metadata>;
export type GetShowsSeasonsResponse200 = FromSchema<
	(typeof schemas.GetShowsSeasons.response)['200']
>;
export type GetShowsSentimentsMetadataParam = FromSchema<
	typeof schemas.GetShowsSentiments.metadata
>;
export type GetShowsSentimentsResponse200 = FromSchema<
	(typeof schemas.GetShowsSentiments.response)['200']
>;
export type GetShowsStatsMetadataParam = FromSchema<typeof schemas.GetShowsStats.metadata>;
export type GetShowsStatsResponse200 = FromSchema<(typeof schemas.GetShowsStats.response)['200']>;
export type GetShowsStreamingMetadataParam = FromSchema<typeof schemas.GetShowsStreaming.metadata>;
export type GetShowsStreamingResponse200 = FromSchema<
	(typeof schemas.GetShowsStreaming.response)['200']
>;
export type GetShowsStudiosMetadataParam = FromSchema<typeof schemas.GetShowsStudios.metadata>;
export type GetShowsStudiosResponse200 = FromSchema<
	(typeof schemas.GetShowsStudios.response)['200']
>;
export type GetShowsSummaryMetadataParam = FromSchema<typeof schemas.GetShowsSummary.metadata>;
export type GetShowsSummaryResponse200 = FromSchema<
	(typeof schemas.GetShowsSummary.response)['200']
>;
export type GetShowsTranslationsMetadataParam = FromSchema<
	typeof schemas.GetShowsTranslations.metadata
>;
export type GetShowsTranslationsResponse200 = FromSchema<
	(typeof schemas.GetShowsTranslations.response)['200']
>;
export type GetShowsTrendingMetadataParam = FromSchema<typeof schemas.GetShowsTrending.metadata>;
export type GetShowsTrendingResponse200 = FromSchema<
	(typeof schemas.GetShowsTrending.response)['200']
>;
export type GetShowsUpdatedIdsMetadataParam = FromSchema<
	typeof schemas.GetShowsUpdatedIds.metadata
>;
export type GetShowsUpdatedIdsResponse200 = FromSchema<
	(typeof schemas.GetShowsUpdatedIds.response)['200']
>;
export type GetShowsUpdatesMetadataParam = FromSchema<typeof schemas.GetShowsUpdates.metadata>;
export type GetShowsUpdatesResponse200 = FromSchema<
	(typeof schemas.GetShowsUpdates.response)['200']
>;
export type GetShowsVideosMetadataParam = FromSchema<typeof schemas.GetShowsVideos.metadata>;
export type GetShowsVideosResponse200 = FromSchema<(typeof schemas.GetShowsVideos.response)['200']>;
export type GetShowsWatchedMetadataParam = FromSchema<typeof schemas.GetShowsWatched.metadata>;
export type GetShowsWatchedResponse200 = FromSchema<
	(typeof schemas.GetShowsWatched.response)['200']
>;
export type GetShowsWatchingMetadataParam = FromSchema<typeof schemas.GetShowsWatching.metadata>;
export type GetShowsWatchingResponse200 = FromSchema<
	(typeof schemas.GetShowsWatching.response)['200']
>;
export type GetShowsWatchnowMetadataParam = FromSchema<typeof schemas.GetShowsWatchnow.metadata>;
export type GetShowsWatchnowResponse200 = FromSchema<
	(typeof schemas.GetShowsWatchnow.response)['200']
>;
export type GetSocialRecommendationsMoviesRecommendMetadataParam = FromSchema<
	typeof schemas.GetSocialRecommendationsMoviesRecommend.metadata
>;
export type GetSocialRecommendationsMoviesRecommendResponse200 = FromSchema<
	(typeof schemas.GetSocialRecommendationsMoviesRecommend.response)['200']
>;
export type GetSocialRecommendationsShowsRecommendMetadataParam = FromSchema<
	typeof schemas.GetSocialRecommendationsShowsRecommend.metadata
>;
export type GetSocialRecommendationsShowsRecommendResponse200 = FromSchema<
	(typeof schemas.GetSocialRecommendationsShowsRecommend.response)['200']
>;
export type GetSyncCollectionAllMetadataParam = FromSchema<
	typeof schemas.GetSyncCollectionAll.metadata
>;
export type GetSyncCollectionAllResponse200 = FromSchema<
	(typeof schemas.GetSyncCollectionAll.response)['200']
>;
export type GetSyncCollectionEpisodesMetadataParam = FromSchema<
	typeof schemas.GetSyncCollectionEpisodes.metadata
>;
export type GetSyncCollectionEpisodesResponse200 = FromSchema<
	(typeof schemas.GetSyncCollectionEpisodes.response)['200']
>;
export type GetSyncCollectionMediaMetadataParam = FromSchema<
	typeof schemas.GetSyncCollectionMedia.metadata
>;
export type GetSyncCollectionMediaResponse200 = FromSchema<
	(typeof schemas.GetSyncCollectionMedia.response)['200']
>;
export type GetSyncCollectionMinimalEpisodesMetadataParam = FromSchema<
	typeof schemas.GetSyncCollectionMinimalEpisodes.metadata
>;
export type GetSyncCollectionMinimalEpisodesResponse200 = FromSchema<
	(typeof schemas.GetSyncCollectionMinimalEpisodes.response)['200']
>;
export type GetSyncCollectionMinimalMoviesMetadataParam = FromSchema<
	typeof schemas.GetSyncCollectionMinimalMovies.metadata
>;
export type GetSyncCollectionMinimalMoviesResponse200 = FromSchema<
	(typeof schemas.GetSyncCollectionMinimalMovies.response)['200']
>;
export type GetSyncCollectionMinimalShowsMetadataParam = FromSchema<
	typeof schemas.GetSyncCollectionMinimalShows.metadata
>;
export type GetSyncCollectionMinimalShowsResponse200 = FromSchema<
	(typeof schemas.GetSyncCollectionMinimalShows.response)['200']
>;
export type GetSyncCollectionMoviesMetadataParam = FromSchema<
	typeof schemas.GetSyncCollectionMovies.metadata
>;
export type GetSyncCollectionMoviesResponse200 = FromSchema<
	(typeof schemas.GetSyncCollectionMovies.response)['200']
>;
export type GetSyncCollectionShowsMetadataParam = FromSchema<
	typeof schemas.GetSyncCollectionShows.metadata
>;
export type GetSyncCollectionShowsResponse200 = FromSchema<
	(typeof schemas.GetSyncCollectionShows.response)['200']
>;
export type GetSyncFavoritesGetMetadataParam = FromSchema<
	typeof schemas.GetSyncFavoritesGet.metadata
>;
export type GetSyncFavoritesGetResponse200 = FromSchema<
	(typeof schemas.GetSyncFavoritesGet.response)['200']
>;
export type GetSyncHistoryGetMetadataParam = FromSchema<typeof schemas.GetSyncHistoryGet.metadata>;
export type GetSyncHistoryGetResponse200 = FromSchema<
	(typeof schemas.GetSyncHistoryGet.response)['200']
>;
export type GetSyncLastActivitiesResponse200 = FromSchema<
	(typeof schemas.GetSyncLastActivities.response)['200']
>;
export type GetSyncProgressMoviesMetadataParam = FromSchema<
	typeof schemas.GetSyncProgressMovies.metadata
>;
export type GetSyncProgressMoviesResponse200 = FromSchema<
	(typeof schemas.GetSyncProgressMovies.response)['200']
>;
export type GetSyncProgressPlaybackMetadataParam = FromSchema<
	typeof schemas.GetSyncProgressPlayback.metadata
>;
export type GetSyncProgressPlaybackResponse200 = FromSchema<
	(typeof schemas.GetSyncProgressPlayback.response)['200']
>;
export type GetSyncProgressUpNextNitroMetadataParam = FromSchema<
	typeof schemas.GetSyncProgressUpNextNitro.metadata
>;
export type GetSyncProgressUpNextNitroResponse200 = FromSchema<
	(typeof schemas.GetSyncProgressUpNextNitro.response)['200']
>;
export type GetSyncProgressUpNextStandardMetadataParam = FromSchema<
	typeof schemas.GetSyncProgressUpNextStandard.metadata
>;
export type GetSyncProgressUpNextStandardResponse200 = FromSchema<
	(typeof schemas.GetSyncProgressUpNextStandard.response)['200']
>;
export type GetSyncProgressWatchedMetadataParam = FromSchema<
	typeof schemas.GetSyncProgressWatched.metadata
>;
export type GetSyncProgressWatchedResponse200 = FromSchema<
	(typeof schemas.GetSyncProgressWatched.response)['200']
>;
export type GetSyncRatingsGetMetadataParam = FromSchema<typeof schemas.GetSyncRatingsGet.metadata>;
export type GetSyncRatingsGetResponse200 = FromSchema<
	(typeof schemas.GetSyncRatingsGet.response)['200']
>;
export type GetSyncWatchedMetadataParam = FromSchema<typeof schemas.GetSyncWatched.metadata>;
export type GetSyncWatchedResponse200 = FromSchema<(typeof schemas.GetSyncWatched.response)['200']>;
export type GetSyncWatchlistGetMetadataParam = FromSchema<
	typeof schemas.GetSyncWatchlistGet.metadata
>;
export type GetSyncWatchlistGetResponse200 = FromSchema<
	(typeof schemas.GetSyncWatchlistGet.response)['200']
>;
export type GetTeamMembersMetadataParam = FromSchema<typeof schemas.GetTeamMembers.metadata>;
export type GetTeamMembersResponse200 = FromSchema<(typeof schemas.GetTeamMembers.response)['200']>;
export type GetUsersActivitiesMetadataParam = FromSchema<
	typeof schemas.GetUsersActivities.metadata
>;
export type GetUsersActivitiesResponse200 = FromSchema<
	(typeof schemas.GetUsersActivities.response)['200']
>;
export type GetUsersBlockedResponse200 = FromSchema<
	(typeof schemas.GetUsersBlocked.response)['200']
>;
export type GetUsersCollectionMetadataParam = FromSchema<
	typeof schemas.GetUsersCollection.metadata
>;
export type GetUsersCollectionResponse200 = FromSchema<
	(typeof schemas.GetUsersCollection.response)['200']
>;
export type GetUsersCommentsMetadataParam = FromSchema<typeof schemas.GetUsersComments.metadata>;
export type GetUsersCommentsResponse200 = FromSchema<
	(typeof schemas.GetUsersComments.response)['200']
>;
export type GetUsersFavoritesCommentsMetadataParam = FromSchema<
	typeof schemas.GetUsersFavoritesComments.metadata
>;
export type GetUsersFavoritesCommentsResponse200 = FromSchema<
	(typeof schemas.GetUsersFavoritesComments.response)['200']
>;
export type GetUsersFavoritesMediaMetadataParam = FromSchema<
	typeof schemas.GetUsersFavoritesMedia.metadata
>;
export type GetUsersFavoritesMediaResponse200 = FromSchema<
	(typeof schemas.GetUsersFavoritesMedia.response)['200']
>;
export type GetUsersFavoritesMoviesMetadataParam = FromSchema<
	typeof schemas.GetUsersFavoritesMovies.metadata
>;
export type GetUsersFavoritesMoviesResponse200 = FromSchema<
	(typeof schemas.GetUsersFavoritesMovies.response)['200']
>;
export type GetUsersFavoritesShowsMetadataParam = FromSchema<
	typeof schemas.GetUsersFavoritesShows.metadata
>;
export type GetUsersFavoritesShowsResponse200 = FromSchema<
	(typeof schemas.GetUsersFavoritesShows.response)['200']
>;
export type GetUsersFavoritesTypedSortedMetadataParam = FromSchema<
	typeof schemas.GetUsersFavoritesTypedSorted.metadata
>;
export type GetUsersFavoritesTypedSortedResponse200 = FromSchema<
	(typeof schemas.GetUsersFavoritesTypedSorted.response)['200']
>;
export type GetUsersFiltersSavedMetadataParam = FromSchema<
	typeof schemas.GetUsersFiltersSaved.metadata
>;
export type GetUsersFiltersSavedResponse200 = FromSchema<
	(typeof schemas.GetUsersFiltersSaved.response)['200']
>;
export type GetUsersFollowersMetadataParam = FromSchema<typeof schemas.GetUsersFollowers.metadata>;
export type GetUsersFollowersResponse200 = FromSchema<
	(typeof schemas.GetUsersFollowers.response)['200']
>;
export type GetUsersFollowingMetadataParam = FromSchema<typeof schemas.GetUsersFollowing.metadata>;
export type GetUsersFollowingResponse200 = FromSchema<
	(typeof schemas.GetUsersFollowing.response)['200']
>;
export type GetUsersFriendsMetadataParam = FromSchema<typeof schemas.GetUsersFriends.metadata>;
export type GetUsersFriendsResponse200 = FromSchema<
	(typeof schemas.GetUsersFriends.response)['200']
>;
export type GetUsersHiddenDroppedMetadataParam = FromSchema<
	typeof schemas.GetUsersHiddenDropped.metadata
>;
export type GetUsersHiddenDroppedResponse200 = FromSchema<
	(typeof schemas.GetUsersHiddenDropped.response)['200']
>;
export type GetUsersHiddenGetBySectionMetadataParam = FromSchema<
	typeof schemas.GetUsersHiddenGetBySection.metadata
>;
export type GetUsersHiddenGetBySectionResponse200 = FromSchema<
	(typeof schemas.GetUsersHiddenGetBySection.response)['200']
>;
export type GetUsersHiddenGetMetadataParam = FromSchema<typeof schemas.GetUsersHiddenGet.metadata>;
export type GetUsersHiddenGetResponse200 = FromSchema<
	(typeof schemas.GetUsersHiddenGet.response)['200']
>;
export type GetUsersHistoryAllMetadataParam = FromSchema<
	typeof schemas.GetUsersHistoryAll.metadata
>;
export type GetUsersHistoryAllResponse200 = FromSchema<
	(typeof schemas.GetUsersHistoryAll.response)['200']
>;
export type GetUsersHistoryEpisodeMetadataParam = FromSchema<
	typeof schemas.GetUsersHistoryEpisode.metadata
>;
export type GetUsersHistoryEpisodeResponse200 = FromSchema<
	(typeof schemas.GetUsersHistoryEpisode.response)['200']
>;
export type GetUsersHistoryEpisodesMetadataParam = FromSchema<
	typeof schemas.GetUsersHistoryEpisodes.metadata
>;
export type GetUsersHistoryEpisodesResponse200 = FromSchema<
	(typeof schemas.GetUsersHistoryEpisodes.response)['200']
>;
export type GetUsersHistoryMovieMetadataParam = FromSchema<
	typeof schemas.GetUsersHistoryMovie.metadata
>;
export type GetUsersHistoryMovieResponse200 = FromSchema<
	(typeof schemas.GetUsersHistoryMovie.response)['200']
>;
export type GetUsersHistoryMoviesMetadataParam = FromSchema<
	typeof schemas.GetUsersHistoryMovies.metadata
>;
export type GetUsersHistoryMoviesResponse200 = FromSchema<
	(typeof schemas.GetUsersHistoryMovies.response)['200']
>;
export type GetUsersHistoryShowMetadataParam = FromSchema<
	typeof schemas.GetUsersHistoryShow.metadata
>;
export type GetUsersHistoryShowResponse200 = FromSchema<
	(typeof schemas.GetUsersHistoryShow.response)['200']
>;
export type GetUsersHistoryShowsMetadataParam = FromSchema<
	typeof schemas.GetUsersHistoryShows.metadata
>;
export type GetUsersHistoryShowsResponse200 = FromSchema<
	(typeof schemas.GetUsersHistoryShows.response)['200']
>;
export type GetUsersHistoryTypedItemMetadataParam = FromSchema<
	typeof schemas.GetUsersHistoryTypedItem.metadata
>;
export type GetUsersHistoryTypedItemResponse200 = FromSchema<
	(typeof schemas.GetUsersHistoryTypedItem.response)['200']
>;
export type GetUsersLikesMetadataParam = FromSchema<typeof schemas.GetUsersLikes.metadata>;
export type GetUsersLikesResponse200 = FromSchema<(typeof schemas.GetUsersLikes.response)['200']>;
export type GetUsersListsCollaborationsMetadataParam = FromSchema<
	typeof schemas.GetUsersListsCollaborations.metadata
>;
export type GetUsersListsCollaborationsResponse200 = FromSchema<
	(typeof schemas.GetUsersListsCollaborations.response)['200']
>;
export type GetUsersListsListCommentsMetadataParam = FromSchema<
	typeof schemas.GetUsersListsListComments.metadata
>;
export type GetUsersListsListCommentsResponse200 = FromSchema<
	(typeof schemas.GetUsersListsListComments.response)['200']
>;
export type GetUsersListsListItemsAllMetadataParam = FromSchema<
	typeof schemas.GetUsersListsListItemsAll.metadata
>;
export type GetUsersListsListItemsAllResponse200 = FromSchema<
	(typeof schemas.GetUsersListsListItemsAll.response)['200']
>;
export type GetUsersListsListItemsMediaMetadataParam = FromSchema<
	typeof schemas.GetUsersListsListItemsMedia.metadata
>;
export type GetUsersListsListItemsMediaResponse200 = FromSchema<
	(typeof schemas.GetUsersListsListItemsMedia.response)['200']
>;
export type GetUsersListsListItemsMovieMetadataParam = FromSchema<
	typeof schemas.GetUsersListsListItemsMovie.metadata
>;
export type GetUsersListsListItemsMovieResponse200 = FromSchema<
	(typeof schemas.GetUsersListsListItemsMovie.response)['200']
>;
export type GetUsersListsListItemsShowMetadataParam = FromSchema<
	typeof schemas.GetUsersListsListItemsShow.metadata
>;
export type GetUsersListsListItemsShowResponse200 = FromSchema<
	(typeof schemas.GetUsersListsListItemsShow.response)['200']
>;
export type GetUsersListsListItemsTypedSortedMetadataParam = FromSchema<
	typeof schemas.GetUsersListsListItemsTypedSorted.metadata
>;
export type GetUsersListsListItemsTypedSortedResponse200 = FromSchema<
	(typeof schemas.GetUsersListsListItemsTypedSorted.response)['200']
>;
export type GetUsersListsListLikesMetadataParam = FromSchema<
	typeof schemas.GetUsersListsListLikes.metadata
>;
export type GetUsersListsListLikesResponse200 = FromSchema<
	(typeof schemas.GetUsersListsListLikes.response)['200']
>;
export type GetUsersListsListSummaryMetadataParam = FromSchema<
	typeof schemas.GetUsersListsListSummary.metadata
>;
export type GetUsersListsListSummaryResponse200 = FromSchema<
	(typeof schemas.GetUsersListsListSummary.response)['200']
>;
export type GetUsersListsPersonalMetadataParam = FromSchema<
	typeof schemas.GetUsersListsPersonal.metadata
>;
export type GetUsersListsPersonalResponse200 = FromSchema<
	(typeof schemas.GetUsersListsPersonal.response)['200']
>;
export type GetUsersMonthInReviewMetadataParam = FromSchema<
	typeof schemas.GetUsersMonthInReview.metadata
>;
export type GetUsersMonthInReviewResponse200 = FromSchema<
	(typeof schemas.GetUsersMonthInReview.response)['200']
>;
export type GetUsersNotesMetadataParam = FromSchema<typeof schemas.GetUsersNotes.metadata>;
export type GetUsersNotesResponse200 = FromSchema<(typeof schemas.GetUsersNotes.response)['200']>;
export type GetUsersPlexServerAccountsMetadataParam = FromSchema<
	typeof schemas.GetUsersPlexServerAccounts.metadata
>;
export type GetUsersPlexServerAccountsResponse200 = FromSchema<
	(typeof schemas.GetUsersPlexServerAccounts.response)['200']
>;
export type GetUsersPlexServerAccountsResponse401 = FromSchema<
	(typeof schemas.GetUsersPlexServerAccounts.response)['401']
>;
export type GetUsersPlexServerAccountsResponse404 = FromSchema<
	(typeof schemas.GetUsersPlexServerAccounts.response)['404']
>;
export type GetUsersPlexServerAccountsResponse422 = FromSchema<
	(typeof schemas.GetUsersPlexServerAccounts.response)['422']
>;
export type GetUsersPlexServerAccountsResponse502 = FromSchema<
	(typeof schemas.GetUsersPlexServerAccounts.response)['502']
>;
export type GetUsersPlexServerAccountsResponse503 = FromSchema<
	(typeof schemas.GetUsersPlexServerAccounts.response)['503']
>;
export type GetUsersPlexServerAccountsResponse504 = FromSchema<
	(typeof schemas.GetUsersPlexServerAccounts.response)['504']
>;
export type GetUsersPlexServersResponse200 = FromSchema<
	(typeof schemas.GetUsersPlexServers.response)['200']
>;
export type GetUsersPlexServersResponse401 = FromSchema<
	(typeof schemas.GetUsersPlexServers.response)['401']
>;
export type GetUsersPlexServersResponse502 = FromSchema<
	(typeof schemas.GetUsersPlexServers.response)['502']
>;
export type GetUsersPlexServersResponse504 = FromSchema<
	(typeof schemas.GetUsersPlexServers.response)['504']
>;
export type GetUsersPlexSettingsResponse200 = FromSchema<
	(typeof schemas.GetUsersPlexSettings.response)['200']
>;
export type GetUsersProfileMetadataParam = FromSchema<typeof schemas.GetUsersProfile.metadata>;
export type GetUsersProfileResponse200 = FromSchema<
	(typeof schemas.GetUsersProfile.response)['200']
>;
export type GetUsersRatingsAllMetadataParam = FromSchema<
	typeof schemas.GetUsersRatingsAll.metadata
>;
export type GetUsersRatingsAllResponse200 = FromSchema<
	(typeof schemas.GetUsersRatingsAll.response)['200']
>;
export type GetUsersRatingsEpisodesMetadataParam = FromSchema<
	typeof schemas.GetUsersRatingsEpisodes.metadata
>;
export type GetUsersRatingsEpisodesResponse200 = FromSchema<
	(typeof schemas.GetUsersRatingsEpisodes.response)['200']
>;
export type GetUsersRatingsMoviesMetadataParam = FromSchema<
	typeof schemas.GetUsersRatingsMovies.metadata
>;
export type GetUsersRatingsMoviesResponse200 = FromSchema<
	(typeof schemas.GetUsersRatingsMovies.response)['200']
>;
export type GetUsersRatingsShowsMetadataParam = FromSchema<
	typeof schemas.GetUsersRatingsShows.metadata
>;
export type GetUsersRatingsShowsResponse200 = FromSchema<
	(typeof schemas.GetUsersRatingsShows.response)['200']
>;
export type GetUsersRatingsTypedRatingMetadataParam = FromSchema<
	typeof schemas.GetUsersRatingsTypedRating.metadata
>;
export type GetUsersRatingsTypedRatingResponse200 = FromSchema<
	(typeof schemas.GetUsersRatingsTypedRating.response)['200']
>;
export type GetUsersReactionsCommentsMetadataParam = FromSchema<
	typeof schemas.GetUsersReactionsComments.metadata
>;
export type GetUsersReactionsCommentsResponse200 = FromSchema<
	(typeof schemas.GetUsersReactionsComments.response)['200']
>;
export type GetUsersRequestsFollowMetadataParam = FromSchema<
	typeof schemas.GetUsersRequestsFollow.metadata
>;
export type GetUsersRequestsFollowResponse200 = FromSchema<
	(typeof schemas.GetUsersRequestsFollow.response)['200']
>;
export type GetUsersRequestsFollowingMetadataParam = FromSchema<
	typeof schemas.GetUsersRequestsFollowing.metadata
>;
export type GetUsersRequestsFollowingResponse200 = FromSchema<
	(typeof schemas.GetUsersRequestsFollowing.response)['200']
>;
export type GetUsersSettingsMetadataParam = FromSchema<typeof schemas.GetUsersSettings.metadata>;
export type GetUsersSettingsResponse200 = FromSchema<
	(typeof schemas.GetUsersSettings.response)['200']
>;
export type GetUsersStatsMetadataParam = FromSchema<typeof schemas.GetUsersStats.metadata>;
export type GetUsersStatsResponse200 = FromSchema<(typeof schemas.GetUsersStats.response)['200']>;
export type GetUsersSyncsDetailsMetadataParam = FromSchema<
	typeof schemas.GetUsersSyncsDetails.metadata
>;
export type GetUsersSyncsDetailsResponse200 = FromSchema<
	(typeof schemas.GetUsersSyncsDetails.response)['200']
>;
export type GetUsersSyncsDetailsResponse404 = FromSchema<
	(typeof schemas.GetUsersSyncsDetails.response)['404']
>;
export type GetUsersSyncsListByTypeMetadataParam = FromSchema<
	typeof schemas.GetUsersSyncsListByType.metadata
>;
export type GetUsersSyncsListByTypeResponse200 = FromSchema<
	(typeof schemas.GetUsersSyncsListByType.response)['200']
>;
export type GetUsersSyncsListByTypeResponse404 = FromSchema<
	(typeof schemas.GetUsersSyncsListByType.response)['404']
>;
export type GetUsersSyncsListMetadataParam = FromSchema<typeof schemas.GetUsersSyncsList.metadata>;
export type GetUsersSyncsListResponse200 = FromSchema<
	(typeof schemas.GetUsersSyncsList.response)['200']
>;
export type GetUsersSyncsPausedMetadataParam = FromSchema<
	typeof schemas.GetUsersSyncsPaused.metadata
>;
export type GetUsersSyncsPausedResponse200 = FromSchema<
	(typeof schemas.GetUsersSyncsPaused.response)['200']
>;
export type GetUsersSyncsPausedResponse404 = FromSchema<
	(typeof schemas.GetUsersSyncsPaused.response)['404']
>;
export type GetUsersSyncsSkippedMetadataParam = FromSchema<
	typeof schemas.GetUsersSyncsSkipped.metadata
>;
export type GetUsersSyncsSkippedResponse200 = FromSchema<
	(typeof schemas.GetUsersSyncsSkipped.response)['200']
>;
export type GetUsersSyncsSkippedResponse404 = FromSchema<
	(typeof schemas.GetUsersSyncsSkipped.response)['404']
>;
export type GetUsersWatchedMinimalMoviesMetadataParam = FromSchema<
	typeof schemas.GetUsersWatchedMinimalMovies.metadata
>;
export type GetUsersWatchedMinimalMoviesResponse200 = FromSchema<
	(typeof schemas.GetUsersWatchedMinimalMovies.response)['200']
>;
export type GetUsersWatchedMinimalShowsMetadataParam = FromSchema<
	typeof schemas.GetUsersWatchedMinimalShows.metadata
>;
export type GetUsersWatchedMinimalShowsResponse200 = FromSchema<
	(typeof schemas.GetUsersWatchedMinimalShows.response)['200']
>;
export type GetUsersWatchedTypedMetadataParam = FromSchema<
	typeof schemas.GetUsersWatchedTyped.metadata
>;
export type GetUsersWatchedTypedResponse200 = FromSchema<
	(typeof schemas.GetUsersWatchedTyped.response)['200']
>;
export type GetUsersWatchingMetadataParam = FromSchema<typeof schemas.GetUsersWatching.metadata>;
export type GetUsersWatchingResponse200 = FromSchema<
	(typeof schemas.GetUsersWatching.response)['200']
>;
export type GetUsersWatchingResponse204 = FromSchema<
	(typeof schemas.GetUsersWatching.response)['204']
>;
export type GetUsersWatchlistAllMetadataParam = FromSchema<
	typeof schemas.GetUsersWatchlistAll.metadata
>;
export type GetUsersWatchlistAllResponse200 = FromSchema<
	(typeof schemas.GetUsersWatchlistAll.response)['200']
>;
export type GetUsersWatchlistCommentsMetadataParam = FromSchema<
	typeof schemas.GetUsersWatchlistComments.metadata
>;
export type GetUsersWatchlistCommentsResponse200 = FromSchema<
	(typeof schemas.GetUsersWatchlistComments.response)['200']
>;
export type GetUsersWatchlistMoviesMetadataParam = FromSchema<
	typeof schemas.GetUsersWatchlistMovies.metadata
>;
export type GetUsersWatchlistMoviesResponse200 = FromSchema<
	(typeof schemas.GetUsersWatchlistMovies.response)['200']
>;
export type GetUsersWatchlistShowsMetadataParam = FromSchema<
	typeof schemas.GetUsersWatchlistShows.metadata
>;
export type GetUsersWatchlistShowsResponse200 = FromSchema<
	(typeof schemas.GetUsersWatchlistShows.response)['200']
>;
export type GetUsersWatchlistTypedSortedMetadataParam = FromSchema<
	typeof schemas.GetUsersWatchlistTypedSorted.metadata
>;
export type GetUsersWatchlistTypedSortedResponse200 = FromSchema<
	(typeof schemas.GetUsersWatchlistTypedSorted.response)['200']
>;
export type GetUsersYearInReviewMetadataParam = FromSchema<
	typeof schemas.GetUsersYearInReview.metadata
>;
export type GetUsersYearInReviewResponse200 = FromSchema<
	(typeof schemas.GetUsersYearInReview.response)['200']
>;
export type GetWatchnowSourcesAllResponse200 = FromSchema<
	(typeof schemas.GetWatchnowSourcesAll.response)['200']
>;
export type GetWatchnowSourcesCountryMetadataParam = FromSchema<
	typeof schemas.GetWatchnowSourcesCountry.metadata
>;
export type GetWatchnowSourcesCountryResponse200 = FromSchema<
	(typeof schemas.GetWatchnowSourcesCountry.response)['200']
>;
export type GetYounifyConnectionsResponse200 = FromSchema<
	(typeof schemas.GetYounifyConnections.response)['200']
>;
export type PostCheckinStartBodyParam = FromSchema<typeof schemas.PostCheckinStart.body>;
export type PostCheckinStartResponse200 = FromSchema<
	(typeof schemas.PostCheckinStart.response)['200']
>;
export type PostCheckinStartResponse409 = FromSchema<
	(typeof schemas.PostCheckinStart.response)['409']
>;
export type PostCommentsLikeMetadataParam = FromSchema<typeof schemas.PostCommentsLike.metadata>;
export type PostCommentsLikeResponse204 = FromSchema<
	(typeof schemas.PostCommentsLike.response)['204']
>;
export type PostCommentsPostBodyParam = FromSchema<typeof schemas.PostCommentsPost.body>;
export type PostCommentsPostResponse201 = FromSchema<
	(typeof schemas.PostCommentsPost.response)['201']
>;
export type PostCommentsReactionsAddMetadataParam = FromSchema<
	typeof schemas.PostCommentsReactionsAdd.metadata
>;
export type PostCommentsReactionsAddResponse201 = FromSchema<
	(typeof schemas.PostCommentsReactionsAdd.response)['201']
>;
export type PostCommentsReplyBodyParam = FromSchema<typeof schemas.PostCommentsReply.body>;
export type PostCommentsReplyMetadataParam = FromSchema<typeof schemas.PostCommentsReply.metadata>;
export type PostCommentsReplyResponse201 = FromSchema<
	(typeof schemas.PostCommentsReply.response)['201']
>;
export type PostCommentsReportBodyParam = FromSchema<typeof schemas.PostCommentsReport.body>;
export type PostCommentsReportMetadataParam = FromSchema<
	typeof schemas.PostCommentsReport.metadata
>;
export type PostCommentsReportResponse201 = FromSchema<
	(typeof schemas.PostCommentsReport.response)['201']
>;
export type PostCommentsReportResponse400 = FromSchema<
	(typeof schemas.PostCommentsReport.response)['400']
>;
export type PostCommentsReportResponse409 = FromSchema<
	(typeof schemas.PostCommentsReport.response)['409']
>;
export type PostEpisodesReportBodyParam = FromSchema<typeof schemas.PostEpisodesReport.body>;
export type PostEpisodesReportMetadataParam = FromSchema<
	typeof schemas.PostEpisodesReport.metadata
>;
export type PostEpisodesReportResponse201 = FromSchema<
	(typeof schemas.PostEpisodesReport.response)['201']
>;
export type PostEpisodesReportResponse400 = FromSchema<
	(typeof schemas.PostEpisodesReport.response)['400']
>;
export type PostEpisodesReportResponse409 = FromSchema<
	(typeof schemas.PostEpisodesReport.response)['409']
>;
export type PostListsLikeMetadataParam = FromSchema<typeof schemas.PostListsLike.metadata>;
export type PostListsLikeResponse204 = FromSchema<(typeof schemas.PostListsLike.response)['204']>;
export type PostListsReportBodyParam = FromSchema<typeof schemas.PostListsReport.body>;
export type PostListsReportMetadataParam = FromSchema<typeof schemas.PostListsReport.metadata>;
export type PostListsReportResponse201 = FromSchema<
	(typeof schemas.PostListsReport.response)['201']
>;
export type PostListsReportResponse400 = FromSchema<
	(typeof schemas.PostListsReport.response)['400']
>;
export type PostListsReportResponse409 = FromSchema<
	(typeof schemas.PostListsReport.response)['409']
>;
export type PostMoviesJustwatchRefreshMetadataParam = FromSchema<
	typeof schemas.PostMoviesJustwatchRefresh.metadata
>;
export type PostMoviesJustwatchRefreshResponse201 = FromSchema<
	(typeof schemas.PostMoviesJustwatchRefresh.response)['201']
>;
export type PostMoviesRefreshMetadataParam = FromSchema<typeof schemas.PostMoviesRefresh.metadata>;
export type PostMoviesRefreshResponse201 = FromSchema<
	(typeof schemas.PostMoviesRefresh.response)['201']
>;
export type PostMoviesReportBodyParam = FromSchema<typeof schemas.PostMoviesReport.body>;
export type PostMoviesReportMetadataParam = FromSchema<typeof schemas.PostMoviesReport.metadata>;
export type PostMoviesReportResponse201 = FromSchema<
	(typeof schemas.PostMoviesReport.response)['201']
>;
export type PostMoviesReportResponse400 = FromSchema<
	(typeof schemas.PostMoviesReport.response)['400']
>;
export type PostMoviesReportResponse409 = FromSchema<
	(typeof schemas.PostMoviesReport.response)['409']
>;
export type PostNotesCreateBodyParam = FromSchema<typeof schemas.PostNotesCreate.body>;
export type PostNotesCreateResponse201 = FromSchema<
	(typeof schemas.PostNotesCreate.response)['201']
>;
export type PostOauthDeviceCodeBodyParam = FromSchema<typeof schemas.PostOauthDeviceCode.body>;
export type PostOauthDeviceCodeResponse200 = FromSchema<
	(typeof schemas.PostOauthDeviceCode.response)['200']
>;
export type PostOauthDeviceTokenBodyParam = FromSchema<typeof schemas.PostOauthDeviceToken.body>;
export type PostOauthDeviceTokenResponse200 = FromSchema<
	(typeof schemas.PostOauthDeviceToken.response)['200']
>;
export type PostOauthDeviceTokenResponse400 = FromSchema<
	(typeof schemas.PostOauthDeviceToken.response)['400']
>;
export type PostOauthRevokeBodyParam = FromSchema<typeof schemas.PostOauthRevoke.body>;
export type PostOauthRevokeResponse200 = FromSchema<
	(typeof schemas.PostOauthRevoke.response)['200']
>;
export type PostOauthTokenBodyParam = FromSchema<typeof schemas.PostOauthToken.body>;
export type PostOauthTokenResponse200 = FromSchema<(typeof schemas.PostOauthToken.response)['200']>;
export type PostOauthTokenResponse400 = FromSchema<(typeof schemas.PostOauthToken.response)['400']>;
export type PostPeopleRefreshMetadataParam = FromSchema<typeof schemas.PostPeopleRefresh.metadata>;
export type PostPeopleRefreshResponse201 = FromSchema<
	(typeof schemas.PostPeopleRefresh.response)['201']
>;
export type PostPeopleReportBodyParam = FromSchema<typeof schemas.PostPeopleReport.body>;
export type PostPeopleReportMetadataParam = FromSchema<typeof schemas.PostPeopleReport.metadata>;
export type PostPeopleReportResponse201 = FromSchema<
	(typeof schemas.PostPeopleReport.response)['201']
>;
export type PostPeopleReportResponse400 = FromSchema<
	(typeof schemas.PostPeopleReport.response)['400']
>;
export type PostPeopleReportResponse409 = FromSchema<
	(typeof schemas.PostPeopleReport.response)['409']
>;
export type PostScrobblePauseBodyParam = FromSchema<typeof schemas.PostScrobblePause.body>;
export type PostScrobblePauseResponse201 = FromSchema<
	(typeof schemas.PostScrobblePause.response)['201']
>;
export type PostScrobbleStartBodyParam = FromSchema<typeof schemas.PostScrobbleStart.body>;
export type PostScrobbleStartResponse201 = FromSchema<
	(typeof schemas.PostScrobbleStart.response)['201']
>;
export type PostScrobbleStopBodyParam = FromSchema<typeof schemas.PostScrobbleStop.body>;
export type PostScrobbleStopResponse201 = FromSchema<
	(typeof schemas.PostScrobbleStop.response)['201']
>;
export type PostSearchRecentAddBodyParam = FromSchema<typeof schemas.PostSearchRecentAdd.body>;
export type PostSearchRecentAddResponse201 = FromSchema<
	(typeof schemas.PostSearchRecentAdd.response)['201']
>;
export type PostSearchRecentRemoveBodyParam = FromSchema<
	typeof schemas.PostSearchRecentRemove.body
>;
export type PostSearchRecentRemoveResponse204 = FromSchema<
	(typeof schemas.PostSearchRecentRemove.response)['204']
>;
export type PostSeasonsReportBodyParam = FromSchema<typeof schemas.PostSeasonsReport.body>;
export type PostSeasonsReportMetadataParam = FromSchema<typeof schemas.PostSeasonsReport.metadata>;
export type PostSeasonsReportResponse201 = FromSchema<
	(typeof schemas.PostSeasonsReport.response)['201']
>;
export type PostSeasonsReportResponse400 = FromSchema<
	(typeof schemas.PostSeasonsReport.response)['400']
>;
export type PostSeasonsReportResponse409 = FromSchema<
	(typeof schemas.PostSeasonsReport.response)['409']
>;
export type PostShowsEpisodeReportBodyParam = FromSchema<
	typeof schemas.PostShowsEpisodeReport.body
>;
export type PostShowsEpisodeReportMetadataParam = FromSchema<
	typeof schemas.PostShowsEpisodeReport.metadata
>;
export type PostShowsEpisodeReportResponse201 = FromSchema<
	(typeof schemas.PostShowsEpisodeReport.response)['201']
>;
export type PostShowsEpisodeReportResponse400 = FromSchema<
	(typeof schemas.PostShowsEpisodeReport.response)['400']
>;
export type PostShowsEpisodeReportResponse409 = FromSchema<
	(typeof schemas.PostShowsEpisodeReport.response)['409']
>;
export type PostShowsJustwatchRefreshMetadataParam = FromSchema<
	typeof schemas.PostShowsJustwatchRefresh.metadata
>;
export type PostShowsJustwatchRefreshResponse201 = FromSchema<
	(typeof schemas.PostShowsJustwatchRefresh.response)['201']
>;
export type PostShowsProgressResetMetadataParam = FromSchema<
	typeof schemas.PostShowsProgressReset.metadata
>;
export type PostShowsProgressResetResponse200 = FromSchema<
	(typeof schemas.PostShowsProgressReset.response)['200']
>;
export type PostShowsRefreshMetadataParam = FromSchema<typeof schemas.PostShowsRefresh.metadata>;
export type PostShowsRefreshResponse201 = FromSchema<
	(typeof schemas.PostShowsRefresh.response)['201']
>;
export type PostShowsReportBodyParam = FromSchema<typeof schemas.PostShowsReport.body>;
export type PostShowsReportMetadataParam = FromSchema<typeof schemas.PostShowsReport.metadata>;
export type PostShowsReportResponse201 = FromSchema<
	(typeof schemas.PostShowsReport.response)['201']
>;
export type PostShowsReportResponse400 = FromSchema<
	(typeof schemas.PostShowsReport.response)['400']
>;
export type PostShowsReportResponse409 = FromSchema<
	(typeof schemas.PostShowsReport.response)['409']
>;
export type PostShowsSeasonReportBodyParam = FromSchema<typeof schemas.PostShowsSeasonReport.body>;
export type PostShowsSeasonReportMetadataParam = FromSchema<
	typeof schemas.PostShowsSeasonReport.metadata
>;
export type PostShowsSeasonReportResponse201 = FromSchema<
	(typeof schemas.PostShowsSeasonReport.response)['201']
>;
export type PostShowsSeasonReportResponse400 = FromSchema<
	(typeof schemas.PostShowsSeasonReport.response)['400']
>;
export type PostShowsSeasonReportResponse409 = FromSchema<
	(typeof schemas.PostShowsSeasonReport.response)['409']
>;
export type PostSyncCollectionAddBodyParam = FromSchema<typeof schemas.PostSyncCollectionAdd.body>;
export type PostSyncCollectionAddResponse201 = FromSchema<
	(typeof schemas.PostSyncCollectionAdd.response)['201']
>;
export type PostSyncCollectionRemoveBodyParam = FromSchema<
	typeof schemas.PostSyncCollectionRemove.body
>;
export type PostSyncCollectionRemoveResponse200 = FromSchema<
	(typeof schemas.PostSyncCollectionRemove.response)['200']
>;
export type PostSyncFavoritesAddBodyParam = FromSchema<typeof schemas.PostSyncFavoritesAdd.body>;
export type PostSyncFavoritesAddResponse201 = FromSchema<
	(typeof schemas.PostSyncFavoritesAdd.response)['201']
>;
export type PostSyncFavoritesRemoveBodyParam = FromSchema<
	typeof schemas.PostSyncFavoritesRemove.body
>;
export type PostSyncFavoritesRemoveResponse200 = FromSchema<
	(typeof schemas.PostSyncFavoritesRemove.response)['200']
>;
export type PostSyncFavoritesReorderBodyParam = FromSchema<
	typeof schemas.PostSyncFavoritesReorder.body
>;
export type PostSyncFavoritesReorderResponse200 = FromSchema<
	(typeof schemas.PostSyncFavoritesReorder.response)['200']
>;
export type PostSyncHistoryAddBodyParam = FromSchema<typeof schemas.PostSyncHistoryAdd.body>;
export type PostSyncHistoryAddResponse200 = FromSchema<
	(typeof schemas.PostSyncHistoryAdd.response)['200']
>;
export type PostSyncHistoryRemoveBodyParam = FromSchema<typeof schemas.PostSyncHistoryRemove.body>;
export type PostSyncHistoryRemoveResponse200 = FromSchema<
	(typeof schemas.PostSyncHistoryRemove.response)['200']
>;
export type PostSyncRatingsAddBodyParam = FromSchema<typeof schemas.PostSyncRatingsAdd.body>;
export type PostSyncRatingsAddResponse201 = FromSchema<
	(typeof schemas.PostSyncRatingsAdd.response)['201']
>;
export type PostSyncRatingsRemoveBodyParam = FromSchema<typeof schemas.PostSyncRatingsRemove.body>;
export type PostSyncRatingsRemoveResponse200 = FromSchema<
	(typeof schemas.PostSyncRatingsRemove.response)['200']
>;
export type PostSyncWatchlistAddBodyParam = FromSchema<typeof schemas.PostSyncWatchlistAdd.body>;
export type PostSyncWatchlistAddResponse201 = FromSchema<
	(typeof schemas.PostSyncWatchlistAdd.response)['201']
>;
export type PostSyncWatchlistRemoveBodyParam = FromSchema<
	typeof schemas.PostSyncWatchlistRemove.body
>;
export type PostSyncWatchlistRemoveResponse200 = FromSchema<
	(typeof schemas.PostSyncWatchlistRemove.response)['200']
>;
export type PostSyncWatchlistReorderBodyParam = FromSchema<
	typeof schemas.PostSyncWatchlistReorder.body
>;
export type PostSyncWatchlistReorderResponse200 = FromSchema<
	(typeof schemas.PostSyncWatchlistReorder.response)['200']
>;
export type PostUsersBlockMetadataParam = FromSchema<typeof schemas.PostUsersBlock.metadata>;
export type PostUsersBlockResponse201 = FromSchema<(typeof schemas.PostUsersBlock.response)['201']>;
export type PostUsersBlockResponse409 = FromSchema<(typeof schemas.PostUsersBlock.response)['409']>;
export type PostUsersFiltersAddBodyParam = FromSchema<typeof schemas.PostUsersFiltersAdd.body>;
export type PostUsersFiltersAddResponse201 = FromSchema<
	(typeof schemas.PostUsersFiltersAdd.response)['201']
>;
export type PostUsersFollowMetadataParam = FromSchema<typeof schemas.PostUsersFollow.metadata>;
export type PostUsersFollowResponse201 = FromSchema<
	(typeof schemas.PostUsersFollow.response)['201']
>;
export type PostUsersFollowResponse409 = FromSchema<
	(typeof schemas.PostUsersFollow.response)['409']
>;
export type PostUsersHiddenAddBodyParam = FromSchema<typeof schemas.PostUsersHiddenAdd.body>;
export type PostUsersHiddenAddMetadataParam = FromSchema<
	typeof schemas.PostUsersHiddenAdd.metadata
>;
export type PostUsersHiddenAddResponse200 = FromSchema<
	(typeof schemas.PostUsersHiddenAdd.response)['200']
>;
export type PostUsersHiddenRemoveCalendarBodyParam = FromSchema<
	typeof schemas.PostUsersHiddenRemoveCalendar.body
>;
export type PostUsersHiddenRemoveCalendarResponse200 = FromSchema<
	(typeof schemas.PostUsersHiddenRemoveCalendar.response)['200']
>;
export type PostUsersHiddenRemoveProgressBodyParam = FromSchema<
	typeof schemas.PostUsersHiddenRemoveProgress.body
>;
export type PostUsersHiddenRemoveProgressResponse200 = FromSchema<
	(typeof schemas.PostUsersHiddenRemoveProgress.response)['200']
>;
export type PostUsersHiddenRemoveSectionBodyParam = FromSchema<
	typeof schemas.PostUsersHiddenRemoveSection.body
>;
export type PostUsersHiddenRemoveSectionMetadataParam = FromSchema<
	typeof schemas.PostUsersHiddenRemoveSection.metadata
>;
export type PostUsersHiddenRemoveSectionResponse200 = FromSchema<
	(typeof schemas.PostUsersHiddenRemoveSection.response)['200']
>;
export type PostUsersListsCreateBodyParam = FromSchema<typeof schemas.PostUsersListsCreate.body>;
export type PostUsersListsCreateMetadataParam = FromSchema<
	typeof schemas.PostUsersListsCreate.metadata
>;
export type PostUsersListsCreateResponse201 = FromSchema<
	(typeof schemas.PostUsersListsCreate.response)['201']
>;
export type PostUsersListsListAddBodyParam = FromSchema<typeof schemas.PostUsersListsListAdd.body>;
export type PostUsersListsListAddMetadataParam = FromSchema<
	typeof schemas.PostUsersListsListAdd.metadata
>;
export type PostUsersListsListAddResponse201 = FromSchema<
	(typeof schemas.PostUsersListsListAdd.response)['201']
>;
export type PostUsersListsListAddResponse420 = FromSchema<
	(typeof schemas.PostUsersListsListAdd.response)['420']
>;
export type PostUsersListsListLikeMetadataParam = FromSchema<
	typeof schemas.PostUsersListsListLike.metadata
>;
export type PostUsersListsListLikeResponse204 = FromSchema<
	(typeof schemas.PostUsersListsListLike.response)['204']
>;
export type PostUsersListsListRemoveBodyParam = FromSchema<
	typeof schemas.PostUsersListsListRemove.body
>;
export type PostUsersListsListRemoveMetadataParam = FromSchema<
	typeof schemas.PostUsersListsListRemove.metadata
>;
export type PostUsersListsListRemoveResponse200 = FromSchema<
	(typeof schemas.PostUsersListsListRemove.response)['200']
>;
export type PostUsersListsListReorderBodyParam = FromSchema<
	typeof schemas.PostUsersListsListReorder.body
>;
export type PostUsersListsListReorderItemsBodyParam = FromSchema<
	typeof schemas.PostUsersListsListReorderItems.body
>;
export type PostUsersListsListReorderItemsMetadataParam = FromSchema<
	typeof schemas.PostUsersListsListReorderItems.metadata
>;
export type PostUsersListsListReorderItemsResponse200 = FromSchema<
	(typeof schemas.PostUsersListsListReorderItems.response)['200']
>;
export type PostUsersListsListReorderMetadataParam = FromSchema<
	typeof schemas.PostUsersListsListReorder.metadata
>;
export type PostUsersListsListReorderResponse200 = FromSchema<
	(typeof schemas.PostUsersListsListReorder.response)['200']
>;
export type PostUsersListsListReportBodyParam = FromSchema<
	typeof schemas.PostUsersListsListReport.body
>;
export type PostUsersListsListReportMetadataParam = FromSchema<
	typeof schemas.PostUsersListsListReport.metadata
>;
export type PostUsersListsListReportResponse201 = FromSchema<
	(typeof schemas.PostUsersListsListReport.response)['201']
>;
export type PostUsersListsListReportResponse400 = FromSchema<
	(typeof schemas.PostUsersListsListReport.response)['400']
>;
export type PostUsersListsListReportResponse409 = FromSchema<
	(typeof schemas.PostUsersListsListReport.response)['409']
>;
export type PostUsersListsReorderBodyParam = FromSchema<typeof schemas.PostUsersListsReorder.body>;
export type PostUsersListsReorderMetadataParam = FromSchema<
	typeof schemas.PostUsersListsReorder.metadata
>;
export type PostUsersListsReorderResponse200 = FromSchema<
	(typeof schemas.PostUsersListsReorder.response)['200']
>;
export type PostUsersPlexConnectBodyParam = FromSchema<typeof schemas.PostUsersPlexConnect.body>;
export type PostUsersPlexConnectResponse200 = FromSchema<
	(typeof schemas.PostUsersPlexConnect.response)['200']
>;
export type PostUsersPlexConnectResponse400 = FromSchema<
	(typeof schemas.PostUsersPlexConnect.response)['400']
>;
export type PostUsersPlexSyncBodyParam = FromSchema<typeof schemas.PostUsersPlexSync.body>;
export type PostUsersPlexSyncResponse201 = FromSchema<
	(typeof schemas.PostUsersPlexSync.response)['201']
>;
export type PostUsersPlexSyncResponse422 = FromSchema<
	(typeof schemas.PostUsersPlexSync.response)['422']
>;
export type PostUsersReportBodyParam = FromSchema<typeof schemas.PostUsersReport.body>;
export type PostUsersReportMetadataParam = FromSchema<typeof schemas.PostUsersReport.metadata>;
export type PostUsersReportResponse201 = FromSchema<
	(typeof schemas.PostUsersReport.response)['201']
>;
export type PostUsersReportResponse400 = FromSchema<
	(typeof schemas.PostUsersReport.response)['400']
>;
export type PostUsersReportResponse409 = FromSchema<
	(typeof schemas.PostUsersReport.response)['409']
>;
export type PostUsersRequestsApproveMetadataParam = FromSchema<
	typeof schemas.PostUsersRequestsApprove.metadata
>;
export type PostUsersRequestsApproveResponse200 = FromSchema<
	(typeof schemas.PostUsersRequestsApprove.response)['200']
>;
export type PostUsersRequestsApproveResponse404 = FromSchema<
	(typeof schemas.PostUsersRequestsApprove.response)['404']
>;
export type PostYounifyConnectBodyParam = FromSchema<typeof schemas.PostYounifyConnect.body>;
export type PostYounifyConnectResponse200 = FromSchema<
	(typeof schemas.PostYounifyConnect.response)['200']
>;
export type PostYounifyConnectResponse400 = FromSchema<
	(typeof schemas.PostYounifyConnect.response)['400']
>;
export type PostYounifyConnectResponse422 = FromSchema<
	(typeof schemas.PostYounifyConnect.response)['422']
>;
export type PostYounifyRefreshAllMetadataParam = FromSchema<
	typeof schemas.PostYounifyRefreshAll.metadata
>;
export type PostYounifyRefreshAllResponse204 = FromSchema<
	(typeof schemas.PostYounifyRefreshAll.response)['204']
>;
export type PostYounifyRefreshMetadataParam = FromSchema<
	typeof schemas.PostYounifyRefresh.metadata
>;
export type PostYounifyRefreshResponse204 = FromSchema<
	(typeof schemas.PostYounifyRefresh.response)['204']
>;
export type PutCommentsEditBodyParam = FromSchema<typeof schemas.PutCommentsEdit.body>;
export type PutCommentsEditMetadataParam = FromSchema<typeof schemas.PutCommentsEdit.metadata>;
export type PutCommentsEditResponse200 = FromSchema<
	(typeof schemas.PutCommentsEdit.response)['200']
>;
export type PutNotesUpdateBodyParam = FromSchema<typeof schemas.PutNotesUpdate.body>;
export type PutNotesUpdateMetadataParam = FromSchema<typeof schemas.PutNotesUpdate.metadata>;
export type PutNotesUpdateResponse200 = FromSchema<(typeof schemas.PutNotesUpdate.response)['200']>;
export type PutSyncFavoritesUpdateBodyParam = FromSchema<
	typeof schemas.PutSyncFavoritesUpdate.body
>;
export type PutSyncFavoritesUpdateItemBodyParam = FromSchema<
	typeof schemas.PutSyncFavoritesUpdateItem.body
>;
export type PutSyncFavoritesUpdateItemMetadataParam = FromSchema<
	typeof schemas.PutSyncFavoritesUpdateItem.metadata
>;
export type PutSyncFavoritesUpdateItemResponse204 = FromSchema<
	(typeof schemas.PutSyncFavoritesUpdateItem.response)['204']
>;
export type PutSyncFavoritesUpdateResponse200 = FromSchema<
	(typeof schemas.PutSyncFavoritesUpdate.response)['200']
>;
export type PutSyncWatchlistUpdateBodyParam = FromSchema<
	typeof schemas.PutSyncWatchlistUpdate.body
>;
export type PutSyncWatchlistUpdateItemBodyParam = FromSchema<
	typeof schemas.PutSyncWatchlistUpdateItem.body
>;
export type PutSyncWatchlistUpdateItemMetadataParam = FromSchema<
	typeof schemas.PutSyncWatchlistUpdateItem.metadata
>;
export type PutSyncWatchlistUpdateItemResponse204 = FromSchema<
	(typeof schemas.PutSyncWatchlistUpdateItem.response)['204']
>;
export type PutSyncWatchlistUpdateResponse200 = FromSchema<
	(typeof schemas.PutSyncWatchlistUpdate.response)['200']
>;
export type PutUsersAvatarBodyParam = FromSchema<typeof schemas.PutUsersAvatar.body>;
export type PutUsersAvatarResponse204 = FromSchema<(typeof schemas.PutUsersAvatar.response)['204']>;
export type PutUsersAvatarResponse400 = FromSchema<(typeof schemas.PutUsersAvatar.response)['400']>;
export type PutUsersCoverBodyParam = FromSchema<typeof schemas.PutUsersCover.body>;
export type PutUsersCoverResponse204 = FromSchema<(typeof schemas.PutUsersCover.response)['204']>;
export type PutUsersCoverResponse400 = FromSchema<(typeof schemas.PutUsersCover.response)['400']>;
export type PutUsersListsListUpdateBodyParam = FromSchema<
	typeof schemas.PutUsersListsListUpdate.body
>;
export type PutUsersListsListUpdateItemBodyParam = FromSchema<
	typeof schemas.PutUsersListsListUpdateItem.body
>;
export type PutUsersListsListUpdateItemMetadataParam = FromSchema<
	typeof schemas.PutUsersListsListUpdateItem.metadata
>;
export type PutUsersListsListUpdateItemResponse204 = FromSchema<
	(typeof schemas.PutUsersListsListUpdateItem.response)['204']
>;
export type PutUsersListsListUpdateMetadataParam = FromSchema<
	typeof schemas.PutUsersListsListUpdate.metadata
>;
export type PutUsersListsListUpdateResponse200 = FromSchema<
	(typeof schemas.PutUsersListsListUpdate.response)['200']
>;
export type PutUsersPlexUpdateSettingsBodyParam = FromSchema<
	typeof schemas.PutUsersPlexUpdateSettings.body
>;
export type PutUsersPlexUpdateSettingsResponse204 = FromSchema<
	(typeof schemas.PutUsersPlexUpdateSettings.response)['204']
>;
export type PutUsersSaveSettingsBodyParam = FromSchema<typeof schemas.PutUsersSaveSettings.body>;
export type PutUsersSaveSettingsResponse201 = FromSchema<
	(typeof schemas.PutUsersSaveSettings.response)['201']
>;
