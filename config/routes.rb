Rails.application.routes.draw do

  root to: "artists#index"
  resources :artists do
    resources :songs
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
end
  
