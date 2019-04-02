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
        @user.username += '2'
        post :create, params: {user: @user.attributes}
        expect(response).to have_http_status(409)
        json = JSON.parse(response.body)
        expect(json['errors']).to include('email')
      end

      it 'should refuse the user because username already exists' do

        @user.email = "2#{@user.email}"
        post :create, params: {user: @user.attributes}
        expect(response).to have_http_status(409)
        json = JSON.parse(response.body)
        expect(json['errors']).to include('username')
      end
    end

    context 'wrong params' do
      it 'should return 422 because username is missing' do
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
                username: user.username,
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
                username: user.username,
            }
        }

        expect(response).to have_http_status(422)
      end

      it 'should return 422 because passwords don\'t match' do
        user = build(:user)
        post :create, params: {
            user: {
                email: user.email,
                username: user.username,
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
        expect(@json['user']).not_to include('password_digest')
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
  end

  describe 'GET #current' do
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
        get :current
        @json = JSON.parse(response.body)
      end

      it 'should return a 200 code' do
        expect(response).to have_http_status(200)
      end

      it 'should return the user' do
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
        expect(@json['user']).not_to include('password_digest')
      end
    end

    context 'unauthorized' do
      it 'should return 401 unauthorized' do
        create(:user)
        get :current
        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'GET #search' do
    context 'valid params' do
      before do
        @user = create(:user, username: 'test_1')
        create(:user, username: 'test_2')
        create(:user, username: 'test_3')
        create(:user, username: 'other_test_1')
        create(:user, username: 'other_test_2')

        add_authenticated_header(request, @user)

        get :search, params: {username: "test"}
        @json = JSON.parse(response.body)
      end

      it 'should return 2 users' do
        expect(response).to have_http_status(200)
        expect(@json['users']).to be_truthy
        expect(@json['users'].length).to eql(2)
      end

      it 'shouldn\'t return the current user' do
        user_in_array = @json['users'].any? {|user| user['id'] == @user.id }
        expect(user_in_array).not_to eql(true)
      end

      it 'shouldn\'t return the user\'s password digests' do
        expect(@json['users'][0]['password_digest']).not_to be_truthy
      end
    end

    context 'limit number of returned users' do
      it 'should return 5 users max' do
        user = create(:user, username: 'test_1')
        create(:user, username: 'test_2')
        create(:user, username: 'test_3')
        create(:user, username: 'test_4')
        create(:user, username: 'test_5')
        create(:user, username: 'test_6')
        create(:user, username: 'test_7')
        create(:user, username: 'test_8')
        create(:user, username: 'test_9')
        create(:user, username: 'test_10')

        add_authenticated_header(request, user)

        get :search, params: {username: "test"}
        json = JSON.parse(response.body)

        expect(json['users'].length).to eql(5)
      end

    end

    context 'wrong params' do
      it 'should return 400 when the request is malformed' do
        user = create(:user, username: 'test_1')
        create(:user, username: 'test_2')
        create(:user, username: 'test_3')

        add_authenticated_header(request, user)

        get :search, params: {username: ""}
        expect(response).to have_http_status(400)
      end
    end

    context 'unauthorized' do
      it 'should return 401 if the user is not connected' do
        user = create(:user, username: 'test_1')
        create(:user, username: 'test_2')
        create(:user, username: 'test_3')

        get :search, params: {username: "test"}
        expect(response).to have_http_status(401)
      end
    end
  end  
end
