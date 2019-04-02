Rails.application.routes.draw do
  namespace :api do
    post 'user_token' => 'user_token#create'
    get '/users/current' => 'users#current'
    get '/users/search/:username' => 'users#search'
    resources :users, only: [:create, :show]

    resources :events, only: [:index, :create]
    get '/events/:hash' => 'events#show'
    post '/events/:hash/place-poll' => 'place_poll#create'
    post '/events/:hash/place-poll/:id/toggle' => 'place_poll#toggle'
    put '/events/:hash/place-poll/:id/choose-place' => 'place_poll#choose_place'
    delete '/events/:hash/place-poll/chosen-place' => 'place_poll#destroy_chosen_place'

    post '/events/:hash/date-poll' => 'date_poll#create'
    post '/events/:hash/date-poll/:id/toggle' => 'date_poll#toggle'
    put '/events/:hash/date-poll/:id/choose-date' => 'date_poll#choose_date'
    delete '/events/:hash/date-poll/chosen-date' => 'date_poll#destroy_chosen_date'
  end

  root to: 'static_files#index'
  get '*path', to: 'static_files#index'
end
