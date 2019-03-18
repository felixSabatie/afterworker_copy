Rails.application.routes.draw do
  namespace :api do
    post 'user_token' => 'user_token#create'
    get '/users/current' => 'users#current'
    resources :users, only: [:create, :show]

    resources :events, only: [:index, :create]
    get '/events/:hash' => 'events#show'
    post '/events/:hash/place-poll' => 'place_poll#create'
    post '/events/:hash/place-poll/:id/toggle' => 'place_poll#toggle'
    put '/events/:hash/place-poll/:id/choose-place' => 'place_poll#choose_place'

    post '/events/:hash/date-poll' => 'date_poll#create'
    post '/events/:hash/date-poll/:id/toggle' => 'date_poll#toggle'
  end

  root to: 'static_files#index'
  get '*path', to: 'static_files#index'
end
