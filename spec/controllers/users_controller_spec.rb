require 'rails_helper'

RSpec.describe Api::UsersController, type: :controller do
  describe 'POST #create' do
    context 'valid params' do
      before do
        post :create, params: {user: attributes_for(:user)}
      end

      it 'should create the user' do
        expect(response).to have_http_status(200)
        expect(User.count).to eq(1)
      end

      it 'should return the user' do
        json = JSON.parse(response.body)
        expect(json).to include('user')
      end

    end

    context 'already existing indexes' do
      before do
        user = build(:user)
        @user = user.clone
        user.save
      end

      it 'should refuse the user because email already exists' do
        @user.pseudo += '2'
        post :create, params: {user: @user.attributes}
        expect(response).to have_http_status(409)
        json = JSON.parse(response.body)
        expect(json['errors']).to include('email')
      end

      it 'should refuse the user because pseudo already exists' do

        @user.email = "2#{@user.email}"
        post :create, params: {user: @user.attributes}
        expect(response).to have_http_status(409)
        json = JSON.parse(response.body)
        expect(json['errors']).to include('pseudo')
      end
    end

    context 'wrong params' do
      it 'should return 422 because pseudo is missing' do
        user = build(:user)
        post :create, params: {
            user: {
                email: user.email,
                password: user.password,
                password_confirmation: user.password
            }
        }

        expect(response).to have_http_status(422)
      end

      it 'should return 422 because email is missing' do
        user = build(:user)
        post :create, params: {
            user: {
                pseudo: user.pseudo,
                password: user.password,
                password_confirmation: user.password
            }
        }

        expect(response).to have_http_status(422)
      end

      it 'should return 422 because password is missing' do
        user = build(:user)
        post :create, params: {
            user: {
                email: user.email,
                pseudo: user.pseudo,
            }
        }

        expect(response).to have_http_status(422)
      end

      it 'should return 422 because passwords don\'t match' do
        user = build(:user)
        post :create, params: {
            user: {
                email: user.email,
                pseudo: user.pseudo,
                password: user.password,
                password_confirmation: user.password + 'wrong'
            }
        }

        expect(response).to have_http_status(422)
      end
    end
  end

  describe 'GET #show' do
    context 'valid request' do
      before do
        user = create(:user)
        event = create(:event, creator: user)
        chosen_place = create(:place_poll_option, event: event)
        chosen_date = create(:date_poll_option, event: event)
        event.chosen_place = chosen_place
        event.chosen_date = chosen_date
        event.save
        create(:invite, user: user, event: event)

        add_authenticated_header(request, user)
        get :show, params: {id: user.id}
        @json = JSON.parse(response.body)
      end

      it 'should return a 200 code' do
        expect(response).to have_http_status(200)
      end

      it 'should return the user and his dependencies' do
        expect(@json).to include('user')
        expect(@json['user']).to include('events')
        expect(@json['user']).to include('invites')
      end

      it "should return the event's nested dependencies" do
        expect(@json['user']['events'][0]['chosen_place']).to be_truthy
        expect(@json['user']['events'][0]['chosen_date']).to be_truthy
      end

      it "should return the invite' nested dependencies" do
        expect(@json['user']['invites'][0]['event']).to be_truthy
      end

      it 'shouldn\'t return the user\'s password hash' do
        expect(@json['user']).not_to include('password_hash')
      end
    end

    context 'wrong request' do
      it 'should return 404' do
        user = create(:user)
        add_authenticated_header(request, user)
        get :show, params: {id: user.id + 1}
        expect(response).to have_http_status(404)
      end
    end

    context 'unauthorized' do
      it 'should return 401 unauthorized' do
        user = create(:user)
        get :show, params: {id: user.id}
        expect(response).to have_http_status(401)
      end
    end

    context 'getting another user' do

      before do
        user = create(:user)
        user2 = create(:user)
        event = create(:event, creator: user)
        create(:place_poll_option, event: event)
        create(:date_poll_option, event: event)

        add_authenticated_header(request, user2)
        get :show, params: {id: user.id}
        @json = JSON.parse(response.body)
      end

      it 'should return a 200 code' do
        expect(response).to have_http_status(200)
      end

      it 'should return the user without his dependencies' do
        expect(@json).to include('user')
        expect(@json['user']).not_to include('events')
        expect(@json['user']).not_to include('invites')
      end

      it 'shouldn\'t return the user\'s password hash' do
        expect(@json['user']).not_to include('password_hash')
      end
    end
  end
end
